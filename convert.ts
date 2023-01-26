import * as yargs from 'yargs';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { readCsv, Results } from './util';
import { sqlTemplate } from './sqlTemplate';

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
  const result: Results = await readCsv(argv.tableName);
  await sqlTemplate(argv.tableName, result.columns, result.records);

})();
