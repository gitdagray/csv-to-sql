# csv-to-sql-insert
Provide table data as a CSV ([comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values)) file and output a SQL insert statement for a table with the same name as the file.

## Usage ⚙

1. Ensure you have directories named `csv` and `sql` in your project folder.
2. Save your input CSV file in the `csv` directory.
3. Open a terminal window and navigate to the project directory.
4. Run `npm install` to install dependencies (only needed for first-time setup).
5. Use one of the following commands to run the script:

   - Auto-detect delimiter: 
     ```
     npm start YourFileName
     ```

   - Specify custom delimiter (optional):
     ```
     npm start YourFileName --delimiter=X
     ```
     Replace `X` with your delimiter.

   - Specify batch size (optional):
     ```
     npm start YourFileName BatchSize
     ```
     Replace `BatchSize` with the number of rows per batch.

   - Specify both custom delimiter and batch size:
     ```
     npm start YourFileName BatchSize --delimiter=X
     ```

6. Monitor the terminal for progress updates and any error messages.
7. Once complete, find your SQL insert statement in `sql/YourFileName.sql`.

## Supported Delimiters

The script supports various delimiters including:
- Comma (,)
- Semicolon (;)
- Pipe (|)
- Tab (\t)
- Colon (:)

## Examples

1. Process a file named "data.csv":
   ```
   npm start data
   ```

2. Process a semicolon-separated file named "europe_sales.csv":
   ```
   npm start europe_sales --delimiter=";"
   ```

3. Process a tab-separated file named "large_dataset.csv" with a batch size of 1000:
   ```
   npm start large_dataset 1000 --delimiter=\t
   ```

## Troubleshooting

- If you encounter issues with delimiter detection, try specifying the delimiter explicitly using the `--delimiter` option.
- For files with complex data (e.g., fields containing the delimiter character), ensure your CSV is properly formatted with appropriate quoting.
- If processing large files, adjust the batch size to optimize performance and memory usage.

## Support 👨‍💻
- [Create an Issue](https://github.com/gitdagray/csv-to-sql/issues)
- [X: @yesdavidgray](https://x.com/yesdavidgray)

## Contributing 🛠
Please read [CONTRIBUTING.md](https://github.com/gitdagray/csv-to-sql/blob/main/CONTRIBUTING.md) prior to contributing. 

## Code of Conduct 
Please see [CODE_OF_CONDUCT.md](https://github.com/gitdagray/csv-to-sql/blob/main/CODE_OF_CONDUCT.md).
