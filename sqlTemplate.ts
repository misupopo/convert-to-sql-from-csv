
export const sqlTemplate = async (
  tableName: string,
  columns: string[],
) => {
  const template = `INSERT INTO \`${tableName}\``;
  console.log(template);
}
