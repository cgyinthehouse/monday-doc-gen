import fs from "fs";
import path from "path";

const outputFolder = path.resolve(__dirname, "../outputs");
const today = new Date();

export default function cleaner() {
  fs.readdir(outputFolder, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      const [_, date] = file.split("_");
      const [year, month, day] = date.split("-");
      const fileDate = new Date(Number(year), Number(month) - 1, Number(day));
      if (fileDate < today) {
        fs.unlink(path.join(outputFolder, file), (err) => {
          if (err) throw err;
        });
        console.log(`Deleted file: ${file}`);
      }
    }
  });
}
