import express from "express";
import generateDoc from "./docgen";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const port = 8011;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.set("Content-Disposition", `attachment; filename="document.docx"`);
  res.set(
    "Content-Length",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).send();
  } else {
    next();
  }
});

app.post("/generate-doc", async (req, res) => {
  const { name, date, count } = req.body;

  if (
    fs.existsSync(path.resolve(__dirname, `../outputs/${name}_${date}.docx`))
  ) {
    const doc = await fs.openAsBlob(
      path.resolve(__dirname, `../outputs/${name}_${date}.docx`)
    );
    res.send(await doc.arrayBuffer());
    return;
  }

  console.log(name, date, count);
  const doc = generateDoc(name, date, count);
  res.send(Buffer.from(await doc.arrayBuffer()));
});

app.listen(port, () => {
  console.log(`server is listening on ${port} !!!`);
});
