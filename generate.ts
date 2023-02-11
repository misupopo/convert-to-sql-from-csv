import * as yargs from 'yargs';
import { readCsv, Results, exportFile } from './util';
import { sqlTemplate } from './sqlTemplate';
import * as JSON5 from 'json5';
import { readFile } from 'fs/promises';

const argv = yargs
  .option('tableName', {
    alias: 't',
    description: 'table name',
    demandOption: true,
    type: 'string',
  })
  .option('readCsvFileDirectory', {
    alias: 'r',
    description: 'read csv file directory',
    demandOption: false,
    type: 'string',
  })
  .option('exportSqlFileDirectory', {
    alias: 'r',
    description: 'export sql file directory',
    demandOption: false,
    type: 'string',
  })
  .help()
  .parseSync();

(async () => {
  const configFilePath = `./config/config.json5`;
  const config = JSON5.parse(await readFile(configFilePath, 'utf8'))

  const result: Results = await readCsv(argv.tableName, argv.readCsvFileDirectory || config.readCsvFileDirectory);
  const templateData = await sqlTemplate(argv.tableName, result.columns, result.records);

  await exportFile(argv.exportSqlFileDirectory || config.exportSqlFileDirectory, argv.tableName, templateData, 'sql');

  console.log(config);
})();
