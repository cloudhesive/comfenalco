import fs from "fs";

const csvSeparator = process.env.CSV_SEPARATOR ?? ";";

export const buildFile = async (
  items: {
    [key: string]: string;
  }[],
  filename: string,
) => {
  if (!items || !items.length) {
    return;
  }

  const keys: string[] = Object.keys(items[0]);

  let columHearders: string[] = keys;

  const csvContent =
    `sep=${csvSeparator}\n` +
    columHearders.join(csvSeparator) +
    "\n" +
    items
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];

            // cell = cell.toString().replace(/"/g, '""');
            // cell =
            //   cell instanceof Date
            //     ? cell.toLocaleString()
            //     : cell.toString().replace(/"/g, '""');

            return cell;
          })
          .join(csvSeparator);
      })
      .join("\n");

  filename = "saved_from_db.csv";
  const writableStream = fs.createWriteStream(filename, { autoClose: true });

  writableStream.write(csvContent);

  writableStream.close();
};
