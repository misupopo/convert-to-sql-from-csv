import * as yargs from 'yargs';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { readCsv } from './util';

const argv = yargs
  .option('tableName', {
    alias: 't',
    description: 'table name',
    demandOption: true,
    type: 'string',
  })
  .help()
  .parseSync();

(async () => {
  const result = await readCsv(argv.tableName);

  console.log(result);
})();
