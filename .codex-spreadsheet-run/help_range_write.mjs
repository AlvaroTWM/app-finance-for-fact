import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("/Users/alvaro.arambulo/Downloads/Libro2.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);

const help = await workbook.help("range.values");
console.log(help.ndjson ?? help);
