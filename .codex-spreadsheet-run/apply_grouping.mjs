import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/alvaro.arambulo/Downloads/Libro2.xlsx";
const outputDir = "/Users/alvaro.arambulo/Documents/React-loyalty-facturas-project/outputs/libro2-grouped";
const outputPath = `${outputDir}/Libro2_agrupado.xlsx`;
const previewPath = `${outputDir}/preview.png`;

function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text).split(" ").filter(Boolean);
}

function hasPhrase(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function hasToken(tokens, values) {
  const tokenSet = new Set(tokens);
  return [...values].some((value) => tokenSet.has(value));
}

function hasTokenPrefix(tokens, prefixes) {
  return tokens.some((token) => [...prefixes].some((prefix) => token.startsWith(prefix)));
}

function isNumericLike(text) {
  const compact = String(text ?? "").replace(/[\s,.;:+\-_/()]+/g, "");
  return compact.length > 0 && /^\d+$/.test(compact);
}

function classify(rawValue) {
  const text = normalize(rawValue);
  const tokens = tokenize(rawValue);

  if (!text) {
    return "Sin descripcion";
  }
  if (isNumericLike(text)) {
    return "Solo nro. caso";
  }
  if (
    (tokens.length <= 8 &&
      hasPhrase(text, [
        "adjuntamos",
        "adjunto",
        "solicitud de prioridad",
        "se envia correo",
        "enviamos correo",
        "evidencia",
      ])) ||
    (tokens.length <= 6 && hasToken(tokens, new Set(["prioridad", "correo", "evidencia"])))
  ) {
    return "Seguimiento interno";
  }
  if (
    hasToken(
      tokens,
      new Set([
        "premio",
        "premios",
        "sorpresa",
        "camiseta",
        "camisetas",
        "remera",
        "remeras",
        "entrada",
        "entradas",
        "canje",
        "qr",
        "hinchada",
      ])
    )
  ) {
    return "Premios / canjes";
  }
  if (hasToken(tokens, new Set(["desafio", "desafios", "mision", "misiones", "reto", "retos", "mundialista"]))) {
    return "Retos / misiones";
  }
  if (hasTokenPrefix(tokens, new Set(["jubilad"]))) {
    return "Jubilados";
  }
  if (
    hasToken(tokens, new Set(["upy", "upys"])) ||
    hasPhrase(text, [
      "sumar upys",
      "baja de upys",
      "bolsa de combustible",
      "subir al siguiente nivel",
      "perfil black",
      "nivel 4 al momento",
      "nivel actual",
    ])
  ) {
    return "Upys / niveles";
  }
  if (
    hasPhrase(text, [
      "dia de la madre",
      "beneficios para mama",
      "saldo promedio",
      "beneficio para mama",
      "para mama",
    ])
  ) {
    return "Mama / saldo promedio";
  }
  if (
    hasPhrase(text, [
      "plazo",
      "8 dias",
      "ocho dias",
      "72 horas",
      "aguardar",
      "aun no paso",
      "aun no pasaron",
      "en revision",
      "dentro del plazo",
      "acreditacion",
      "se acreditara",
      "estado del reintegro",
      "no procesado",
      "se estara acreditando",
    ])
  ) {
    return "Estado / plazo";
  }
  if (
    hasPhrase(text, [
      "tope",
      "limite",
      "monto minimo",
      "compra minima",
      "inferior",
      "no aplica",
      "no corresponde",
      "tarjeta debito",
      "pos de infonet",
      "pos de dinelco",
      "red infonet",
      "red dinelco",
      "comercio no se encuentra adherido",
      "no se encuentra adherido",
      "no contamos con una promocion especifica",
      "no califico para la promocion",
    ])
  ) {
    return "No aplica / condiciones";
  }
  if (
    hasPhrase(text, [
      "reclama",
      "reclamo",
      "reclamar",
      "molest",
      "alterada",
      "acciones legales",
      "excepcion",
      "revision",
      "actualizacion del cupo",
      "anulada",
      "solicitamos su apoyo",
      "verificacion de un comercio aliado",
    ])
  ) {
    return "Reclamo / revision";
  }
  if (
    hasPhrase(text, [
      "bases y condiciones",
      "byc",
      "promocion",
      "promociones",
      "comercios adheridos",
      "comercio adherido",
      "beneficios vigentes",
      "vigentes",
      "beneficios ueno",
      "tiene reintegro",
      "tiene reitegro",
      "locales adheridos",
    ])
  ) {
    return "Promo / ByC";
  }
  if (text.includes("reintegro") || text.includes("reintegros")) {
    return "Reintegros general";
  }
  return "Otros";
}

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.items[0];
const used = sheet.getUsedRange();
const rows = used.values;

const outputValues = [["Grupo sugerido"]];
const counts = new Map();

for (let i = 1; i < rows.length; i += 1) {
  const description = rows[i]?.[0] ?? "";
  const label = classify(description);
  outputValues.push([label]);
  counts.set(label, (counts.get(label) ?? 0) + 1);
}

sheet.getRange(`B1:B${rows.length}`).values = outputValues;
sheet.getRange(`B1:B${rows.length}`).format.columnWidthPx = 220;

await fs.mkdir(outputDir, { recursive: true });

const preview = await workbook.render({
  sheetName: sheet.name,
  range: `A1:B20`,
  scale: 2,
});
await fs.writeFile(previewPath, Buffer.from(await preview.arrayBuffer()));

const check = await workbook.inspect({
  kind: "table",
  range: `A1:B20`,
  include: "values",
  tableMaxRows: 20,
  tableMaxCols: 2,
});

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula scan",
});

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

const sortedCounts = [...counts.entries()].sort((a, b) => b[1] - a[1]);

console.log("OUTPUT_PATH\t" + outputPath);
console.log("PREVIEW_PATH\t" + previewPath);
console.log("CHECK\t" + check.ndjson);
console.log("ERRORS\t" + errors.ndjson);
for (const [label, count] of sortedCounts) {
  console.log(`GROUP\t${label}\t${count}`);
}
