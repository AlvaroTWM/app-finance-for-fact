import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/alvaro.arambulo/Downloads/Libro2.xlsx";

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

for (const sheet of workbook.worksheets.items) {
  console.log(`SHEET\t${sheet.name}`);
  const used = sheet.usedRange;
  console.log(`USED\t${used.address}`);
  const preview = await workbook.inspect({
    kind: "table",
    sheetId: sheet.id,
    range: used.address,
    include: "values",
    tableMaxRows: 10,
    tableMaxCols: 12,
  });
  console.log(preview.ndjson);
}
