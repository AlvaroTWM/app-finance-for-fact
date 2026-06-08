import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const stopwords = new Set([
  "a","al","algo","algun","alguna","algunas","alguno","algunos","ante","antes","asi","aun",
  "bajo","bien","cada","casi","como","con","contra","cual","cuando","de","del","desde","donde",
  "dos","el","ella","ellas","ellos","en","entre","era","eramos","eran","eres","es","esa","esas",
  "ese","eso","esos","esta","estaba","estaban","estado","estamos","estan","estar","estas","este",
  "esto","estos","fue","fueron","ha","habia","hace","hacen","hacer","hacia","han","hasta","hay",
  "la","las","le","les","lo","los","mas","me","mi","mis","mucho","muy","necesita","ni","no","nos",
  "o","os","otra","otro","para","pero","poco","por","porque","que","quien","se","sea","segun","ser",
  "si","sin","sobre","son","su","sus","tal","tambien","te","tiene","tienen","todo","tras","tu","un",
  "una","uno","unos","usted","ya","e","u","y","cliente","caso","consulta","indica","comenta",
  "verifica","verificamos","solicitud","estimados","buenas","referencia","respecto","contacta",
  "favor","dias","dia","habiles","hace","hacer","hacerlo","acredita","acreditan","acreditando",
  "favor","numero","nro","bases","correo","mensaje","saludos","quedamos","estimado","estimada"
]);

function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTokens(text) {
  const normalized = normalize(text);
  return normalized
    .split(" ")
    .filter((token) =>
      token &&
      !stopwords.has(token) &&
      !/^\d+$/.test(token) &&
      token.length >= 3
    );
}

const input = await FileBlob.load("/Users/alvaro.arambulo/Downloads/Libro2.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.items[0];
const used = sheet.getUsedRange();
const preview = await workbook.inspect({
  kind: "table",
  range: used.address,
  include: "values",
  tableMaxRows: 5000,
  tableMaxCols: 2,
});

const parsed = JSON.parse(preview.ndjson.trim());
const rows = parsed.values.slice(1).map((row) => row[0]);

const tokenCounts = new Map();
const samplesByToken = new Map();

for (const row of rows) {
  const tokens = [...new Set(getTokens(row))];
  for (const token of tokens) {
    tokenCounts.set(token, (tokenCounts.get(token) ?? 0) + 1);
    if (!samplesByToken.has(token)) {
      samplesByToken.set(token, []);
    }
    const bucket = samplesByToken.get(token);
    if (bucket.length < 3) {
      bucket.push(String(row));
    }
  }
}

const topTokens = [...tokenCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 40);

for (const [token, count] of topTokens) {
  console.log(`TOKEN\t${token}\t${count}`);
  for (const sample of samplesByToken.get(token) ?? []) {
    console.log(`  SAMPLE\t${sample}`);
  }
}
