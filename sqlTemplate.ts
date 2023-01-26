
export const sqlTemplate = async (
  tableName: string,
  columns: string[],
  records: Object[],
) => {
  const result = enumerateColumns(columns);

  const template = `INSERT INTO \`${tableName}\` (${result}) \n` +
    `VALUES\n` +
    `${emulateRecords(records)};`;

  console.log(template);
}

const enumerateColumns = (columns: string[]) => {
  return columns.map((column) => `\`${column}\``).join(', ');
}

const emulateRecords = (columns: Object[]) => {
  const renderRow = (row) => {
    const lastIndexNumber = Object.keys(row).length - 1;

    return Object.keys(row).reduce((columnValue, key, index) => {
      columnValue = `${columnValue}'${row[key]}'${index === lastIndexNumber ? '' : ','} `;
      return columnValue;
    }, '');
  }

  const lastIndexNumber = columns.length - 1;

  return columns.reduce((acc, row, index) => {
    const rowValue = renderRow(row);
    acc = acc + `\t(${rowValue})${index === lastIndexNumber ? ';' : ','}\n`;

    return acc;
  }, '');
}
