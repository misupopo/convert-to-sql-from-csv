import * as fs from 'fs';
import * as csv from 'csv-parser';
import { stat } from 'fs/promises';
import { exec } from 'child_process';
import { mysqlColumnType } from './enum';

export interface Results {
  columns: string[];
  records: string[];
}

export const readCsv = async (readCsvFilePath): Promise<Results> => {
  const readFilePath = `${readCsvFilePath}`;

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

export const exportFile = async (exportSqlFileDirectory, fileName, templateData, extension) => {
  await execCommand(`mkdir -p ${exportSqlFileDirectory}`);

  const sqlFilePath = `${exportSqlFileDirectory}/${fileName}.${extension}`;

  await execCommand(`touch ${sqlFilePath}`);

  fs.writeFileSync(sqlFilePath, templateData);
}

export const readSqlType = async (referSqlStructureFilePath, columns) => {
  const sqlFilePath = `${referSqlStructureFilePath}`;

  const splitContents = fs.readFileSync(sqlFilePath, 'utf8').split('\n');

  console.log('columns: ', columns)

  const structure = columns.reduce((object, column) => {
    const matchedColumnSqlLine = splitContents.find((splitContent) => {
      return splitContent.includes(column);
    });

    console.log('column: ', column)
    console.log('matchedColumnSqlLine: ', matchedColumnSqlLine);

    if (matchedColumnSqlLine) {
       const matchedMysqlColumnTypeKeyName = Object.keys(mysqlColumnType).find((type) => {
        return matchedColumnSqlLine.includes(type)
      });

      object[column] = mysqlColumnType[matchedMysqlColumnTypeKeyName];
    }

    return object;
  }, {});

  console.log(structure);
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
