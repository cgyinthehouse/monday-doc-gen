import express from "express";
import PizZip from "pizzip";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import cron from "node-cron";
import generateDoc from "./docgen";
import cleaner from "./cleaner";

const app = express();
const port = process.env.PORT || 8011;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((_, res, next) => {
  res.set("Content-Disposition", `attachment; filename="document.docx"`);
  res.set(
    "Content-Length",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", ",GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/generate-doc", async (req, res) => {
  const { name, date, count, workerType } = req.body;
  let doc: Blob;

  if (
    fs.existsSync(
      path.resolve(__dirname, `../outputs/${name}_${workerType}_${date}.docx`)
    )
  ) {
    doc = await fs.openAsBlob(
      path.resolve(__dirname, `../outputs/${name}_${workerType}_${date}.docx`)
    );
  } else {
    doc = await generateDoc(name, date, count, workerType);
  }

  console.log(
    new Date(Date.now()).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      hour12: false
    }),
    name,
    date,
    count
  );
  res.send(Buffer.from(await doc.arrayBuffer()));
});

app.post("/pack", (req, res) => {
  const { files } = req.body;
  const zip = new PizZip();
  for (const { name, date, workerType } of files) {
    zip.file(
      `${name}_${workerType}_${date}.docx`,
      fs.readFileSync(
        path.resolve(__dirname, `../outputs/${name}_${workerType}_${date}.docx`)
      )
    );
  }
  res.send(
    zip.generate({
      type: "nodebuffer",
      compression: "DEFLATE"
    })
  );
});

cron.schedule("0 0 * * *", cleaner);

app.listen(port, () => {
  console.log(`server is listening on ${port} !!!`);
});
