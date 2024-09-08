import { promises as fs, existsSync } from "fs";
import { createDirectoryIfNotExists } from "./utils/fileUtils.js";
import * as path from "node:path";

// Escape special characters in SQL values
function escapeValue(value: string): string {
  if (value === "NULL") return "NULL";
  if (!isNaN(Number(value)) && value.trim() !== "") return value;
  return `"${value.replace(/"/g, '""')}"`; // Escape double quotes in string values
}

// Write SQL statement to a file
async function writeSQL(statement: string, saveFileAs = "", isAppend: boolean = false) {
  try {
    const destinationFile = saveFileAs || process.argv[2];
    if (!destinationFile) {
      throw new Error("Missing saveFileAs parameter");
    }
    const sqlFilePath = path.resolve(`./sql/${destinationFile}.sql`);
    
    // Create the SQL directory if it doesn't exist
    await createDirectoryIfNotExists(path.dirname(sqlFilePath));
    
    // Write or append the SQL statement to the file
    if (isAppend) {
      await fs.appendFile(sqlFilePath, statement);
    } else {
      await fs.writeFile(sqlFilePath, statement);
    }
    console.log(`SQL written to ${sqlFilePath}`);
    //console.log("SQL content:");
    //console.log(statement);
  } catch (err) {
    console.error("Error writing SQL file:", err);
  }
}

// Detect the delimiter used in the CSV file
function detectDelimiter(firstLine: string): string {
  const commonDelimiters = [',', ';', '\t', '|', ':', '\\t'];
  let maxCount = 0;
  let detectedDelimiter = ','; // Default to comma

  for (const delimiter of commonDelimiters) {
    let count;
    if (delimiter === '\t' || delimiter === '\\t') {
      count = (firstLine.match(/\\t/g) || []).length;
    } else {
      // Escape special characters for regex
      const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^"'])${escapedDelimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`, 'g');
      count = (firstLine.match(regex) || []).length;
    }
    if (count > maxCount) {
      maxCount = count;
      detectedDelimiter = delimiter;
    }
  }

  return maxCount > 0 ? detectedDelimiter : ','; // Default to comma if no clear delimiter is found
}

// Parse a single line of the CSV file
function parseCSVLine(line: string, delimiter: string): string[] {
  if (delimiter === '\t' || delimiter === '\\t') {
    // For tab-delimited files, split by actual tabs or escaped tabs
    return line.split(/\t|\\t/).map(value => value.trim().replace(/^"|"$/g, ''));
  }

  const result: string[] = [];
  let currentValue = "";
  let insideQuotes = false;

  // Iterate through each character in the line
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === delimiter && !insideQuotes) {
      result.push(currentValue.trim());
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  result.push(currentValue.trim());

  // Remove surrounding quotes from each value
  return result.map(value => value.replace(/^"|"$/g, ''));
}

// Parse command-line arguments
function parseArguments(args: string[]): { fileAndTableName: string, delimiter: string, batchSize: number } {
  let fileAndTableName = '';
  let delimiter = '';
  let batchSize = 500;

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.split('=');
      if (key === '--delimiter') {
        delimiter = value ? value.replace(/^['"](.+)['"]$/, '$1') : ',';
        if (delimiter === '\\t') delimiter = '\t';
      } else if (key === '--batchSize') {
        batchSize = parseInt(value) || batchSize;
      }
    } else if (!fileAndTableName) {
      fileAndTableName = arg;
    }
  }

  return { fileAndTableName, delimiter, batchSize };
}

// Main function to read CSV and generate SQL
async function readCSV(csvFileName = "", batchSize: number = 0) {
  try {
    // Parse command-line arguments
    const { fileAndTableName, delimiter: parsedDelimiter, batchSize: parsedBatchSize } = parseArguments(process.argv);

    if (!fileAndTableName) {
      throw new Error("Missing csvFileName parameter");
    }

    if (parsedDelimiter) {
      //console.log(`Set delimiter to: ${parsedDelimiter === '\t' ? 'tab' : parsedDelimiter}`);
    }
    //console.log(`Set batchSize to: ${parsedBatchSize}`);

    batchSize = parsedBatchSize || batchSize || 500;
    let isAppend: boolean = false;

    // Read the CSV file
    const csvFilePath = path.resolve(`./csv/${fileAndTableName}.csv`);
    if (!existsSync(csvFilePath)) {
      console.log(`File not found: ${csvFilePath}`);
      return;
    }
    const data = await fs.readFile(csvFilePath, { encoding: "utf8" });
    const linesArray = data.split(/\r?\n/).filter((line) => line);

    // Auto-detect delimiter if not specified
    let delimiter = parsedDelimiter;
    if (!delimiter) {
      delimiter = detectDelimiter(linesArray[0]);
      console.log(`Auto-detected delimiter: "${delimiter === '\t' ? 'tab' : delimiter === '\\t' ? 'escaped tab' : delimiter}"`);
    } else {
      console.log(`Using specified delimiter: "${delimiter === '\t' ? 'tab' : delimiter === '\\t' ? 'escaped tab' : delimiter}"`);
    }

    // Parse column names from the first line
    const columnNames = parseCSVLine(linesArray[0], delimiter);

    // Prepare SQL insert statement
    let beginSQLInsert = `INSERT INTO ${fileAndTableName} (${columnNames.join(', ')})\nVALUES\n`;
    let values = "";

    // Process each row of the CSV
    linesArray.slice(1).forEach((line, index) => {
      const arr = parseCSVLine(line, delimiter);

      // Skip rows with incorrect number of values
      if (arr.length !== columnNames.length) {
        console.log(`Row ${index + 1} has incorrect number of values:`, arr);
        return; // Skip this row
      }

      // Write SQL in batches
      if (index > 0 && index % batchSize == 0) {
        values = values.slice(0, -2) + ";\n\n" + beginSQLInsert;
        writeSQL(values, fileAndTableName, isAppend);
        values = "";
        isAppend = true;
      }

      // Escape values and add to SQL statement
      const escapedValues = arr.map(escapeValue);
      values += `\t(${escapedValues.join(', ')}),\n`;
    });
    
    // Write remaining values
    if (values) {
      values = values.slice(0, -2) + ";"; // Remove last comma and newline, add semicolon
      const sqlStatement = beginSQLInsert + values;
      writeSQL(sqlStatement, fileAndTableName, isAppend);
    }
  } catch (err) {
    console.error("Error reading CSV file:", err);
  }
}

// Start the CSV to SQL conversion process
readCSV();
console.log("Finished!");