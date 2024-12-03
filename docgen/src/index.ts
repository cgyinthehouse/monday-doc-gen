import express from "express";
import PizZip from "pizzip";
import generateDoc from "./docgen";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const port = 8011;
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
  const { name, date, count } = req.body;
  let doc: Blob;

  if (
    fs.existsSync(path.resolve(__dirname, `../outputs/${name}_${date}.docx`))
  ) {
    doc = await fs.openAsBlob(
      path.resolve(__dirname, `../outputs/${name}_${date}.docx`)
    );
  } else {
    doc = await generateDoc(name, date, count);
  }

  console.log(new Date(Date.now()).toLocaleString(), name, date, count);
  res.send(Buffer.from(await doc.arrayBuffer()));
});

app.post("/pack", (req, res) => {
  const { files } = req.body;
  const zip = new PizZip();
  for (const { name, date } of files) {
    zip.file(
      `${name}_${date}.docx`,
      fs.readFileSync(
        path.resolve(__dirname, `../outputs/${name}_${date}.docx`)
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

app.listen(port, () => {
  console.log(`server is listening on ${port} !!!`);
});
