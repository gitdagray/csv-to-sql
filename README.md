# csv-to-sql-insert
Provide table data as a CSV ([comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values)) file and output a SQL insert statement for a table with the same name as the file.

## Usage ⚙
1. Confirm you have a directory named `csv`
2. Confirm you have a directory named `sql`
3. Save your input CSV file in the `csv` directory
4. In a terminal window, first run `npm install` to install dependencies and then run "npm start _yourfilename_". Provide the file name in the command without including the relative path or file extension. Example: If the file is named example.txt and located in the src directory, you should use example in the command, not src/example.txt or example.txt.
5. Watch the terminal window for any error messages
6. Your SQL insert statement will be saved in `sql/YourFileName.sql`

## Support 👨‍💻
- [Create an Issue](https://github.com/gitdagray/csv-to-sql/issues)
- [X: @yesdavidgray](https://x.com/yesdavidgray)

## Contributing 🛠
Please read [CONTRIBUTING.md](https://github.com/gitdagray/csv-to-sql/blob/main/CONTRIBUTING.md) prior to contributing. 

## Code of Conduct 
Please see [CODE_OF_CONDUCT.md](https://github.com/gitdagray/csv-to-sql/blob/main/CODE_OF_CONDUCT.md).
