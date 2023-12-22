# csv-to-sql-insert
Provide table data as a CSV ([comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values)) file and output a SQL insert statement for a table with the same name as the file.

## Usage ⚙
1. Confirm you have a directory named `csv`
2. Confirm you have a directory named `sql`
3. Save your input CSV file in the `csv` directory
4. In a terminal window, run `node . YourFileName`
5. Watch the terminal window for any error messages
6. Your SQL insert statement will be saved in `sql/YourFileName.sql`

### How TO
```node
  run 'node index.js <csv filename>
  
  // To print out an output of your table
  flag = -r OR --read
  run 'node index.js <csv filename> flag
```

## Support 👨‍💻
- [Create an Issue](https://github.com/gitdagray/csv-to-sql/issues)
- [X: @yesdavidgray](https://x.com/yesdavidgray)

## Contributing 🛠
Please read [CONTRIBUTING.md](https://github.com/gitdagray/csv-to-sql/blob/main/CONTRIBUTING.md) prior to contributing. 

## Code of Conduct 
Please see [CODE_OF_CONDUCT.md](https://github.com/gitdagray/csv-to-sql/blob/main/CODE_OF_CONDUCT.md).
