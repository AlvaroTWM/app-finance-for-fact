import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("/Users/alvaro.arambulo/Downloads/Libro2.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const preview = await workbook.render({ sheetName: "Hoja1", range: "A1:B5", format: "png" });

console.log("TYPE", typeof preview);
console.log("CTOR", preview?.constructor?.name);
console.log("KEYS", Object.keys(preview ?? {}));
console.log("HAS_ARRAY_BUFFER", typeof preview?.arrayBuffer);
console.log("HAS_BYTES", typeof preview?.bytes);
