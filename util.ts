import * as fs from 'fs';
import * as csv from 'csv-parser';
import { stat } from 'fs/promises';
import { exec } from 'child_process';

export interface Results {
  columns: string[];
  records: string[];
}

export const readCsv = async (tableName, readCsvFileDirectory): Promise<Results> => {
  const readFilePath = `${readCsvFileDirectory}/${tableName}.csv`;

  try {
    await stat(readFilePath);
  } catch (e) {
    throw new Error(`file doesn't exist in path`);
  }

  const results = {
    columns: [],
    records: [],
  };

  return new Promise((resolve, reject) => {
    fs.createReadStream(readFilePath)
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

export const exportSql = async (exportSqlFileDirectory, fileName, templateData) => {
  await execCommand(`mkdir -p ${exportSqlFileDirectory}`);

  const sqlFile = `${exportSqlFileDirectory}/${fileName}.sql`;

  await execCommand(`touch ${sqlFile}`);

  fs.writeFileSync(sqlFile, templateData);
}

const execCommand = (command: string) => {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        stdout,
        stderr,
      });
    });
  });
}
