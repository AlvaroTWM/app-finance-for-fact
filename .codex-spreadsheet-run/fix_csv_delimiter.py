import csv
import sys
from pathlib import Path


OUTPUT_DIR = Path("/Users/alvaro.arambulo/Documents/React-loyalty-facturas-project/outputs/csv-fixes")


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Uso: fix_csv_delimiter.py <input.csv> [output.csv]")

    input_path = Path(sys.argv[1]).expanduser()
    if len(sys.argv) >= 3:
        output_path = Path(sys.argv[2]).expanduser()
    else:
        output_path = OUTPUT_DIR / f"{input_path.stem}_corregido.csv"

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with input_path.open("r", encoding="utf-8-sig", newline="") as src:
        reader = csv.reader(src)
        rows = list(reader)

    if not rows:
        raise ValueError("El archivo CSV está vacío.")

    expected_len = len(rows[0])
    bad_rows = [index + 1 for index, row in enumerate(rows) if len(row) != expected_len]
    if bad_rows:
        raise ValueError(f"Se detectaron filas con cantidad distinta de columnas: {bad_rows[:20]}")

    with output_path.open("w", encoding="utf-8-sig", newline="") as dst:
        writer = csv.writer(
            dst,
            delimiter=";",
            quotechar='"',
            quoting=csv.QUOTE_MINIMAL,
        )
        writer.writerows(rows)

    print(f"OUTPUT={output_path}")
    print(f"ROWS={len(rows) - 1}")
    print(f"COLUMNS={expected_len}")


if __name__ == "__main__":
    main()
