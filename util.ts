import * as fs from 'fs';
import * as csv from 'csv-parser';

export const readCsv = async (tableName) => {
  const fileName = `files/${tableName}.csv`;
  const results = {
    columns: [],
    records: [],
  };

  return new Promise((resolve, reject) => {
    fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (data) => {
        results.records.push(data)
      })
      .on('end', () => {
        Object.keys(results.records[0]).forEach((key) => {
          results.columns.push(key);
        });

        resolve(results);
      });
  });
}
