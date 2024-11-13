import express from "express";
import generateDoc from "./docgen";
import bodyParser from "body-parser";

const app = express();
const port = 8011;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:8301");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Vary", "Origin");
  if (req.method === "OPTIONS") {
    res.status(200).send();
  } else {
    next();
  }
});

app.post("/generate-doc", async (req, res) => {
  const { name, date, count } = req.body;
  console.log(name, date, count);
  const doc = generateDoc(name, date, count);
  res.set("Content-Disposition", `attachment; filename="document.docx"`);
  res.set("Content-Type", doc.type);
  res.send(Buffer.from(await doc.arrayBuffer()));
});

app.listen(port, () => {
  console.log(`server is listening on ${port} !!!`);
});
