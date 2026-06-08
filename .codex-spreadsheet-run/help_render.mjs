import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("/Users/alvaro.arambulo/Downloads/Libro2.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);

const help = await workbook.help("workbook.render");
console.log(help.ndjson ?? help);
