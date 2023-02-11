import * as yargs from 'yargs';
import * as JSON5 from 'json5';
import { readFile } from 'fs/promises';
import { readCsv, Results, exportFile, readSqlType } from './util';

const argv = yargs
  .option('referSqlStructureFilePath', {
    alias: 's',
    description: 'refer sql structure file path',
    demandOption: true,
    type: 'string',
  })
  .option('readCsvFilePath', {
    alias: 'r',
    description: 'read csv file path',
    demandOption: true,
    type: 'string',
  })
  .help()
  .parseSync();

(async () => {
  const configFilePath = `./config/config.json5`;
  const config = JSON5.parse(await readFile(configFilePath, 'utf8'));

  const result: Results = await readCsv(argv.readCsvFilePath);

  await readSqlType(argv.referSqlStructureFilePath, result.columns);

  // await exportFile('./types', argv.tableName, {
  //   [argv.tableName]: {
  //     ...
  //   }
  // });
})();
