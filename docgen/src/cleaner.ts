import fs from "fs";
import { globSync } from "node:fs";
import path from "path";

const outputFolder = path.resolve(__dirname, "../outputs");
const today = new Date();

export default function cleaner() {
  try {
    const files = globSync("*.docx", {
      cwd: outputFolder,
      exclude: (f) => !/.+_\d{4}-\d{2}-\d{2}/.test(f)
    });
    for (const file of files) {
      const [_contractor, _workertype, date] = file.split("_");
      const [year, month, day] = date.split("-");
      const fileDate = new Date(Number(year), Number(month) - 1, Number(day));
      if (fileDate < today) {
        fs.unlink(path.join(outputFolder, file), (err) => {
          if (err) throw err;
        });
        console.log(`Deleted file: ${file}`);
      }
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}
