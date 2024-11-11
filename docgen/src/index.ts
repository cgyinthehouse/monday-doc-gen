import express from "express";
import generateDoc from "./docgen";

const app = express();
const port = 8011;

app.post("/generate-doc", (req, res) => {
  const { name, date, count } = req.body;
  const doc = generateDoc(name, date, count);
  res.set("Content-Disposition", `attachment; filename="document.docx"`);
  res.set(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.send(doc);
});


app.listen(port, () => {
  console.log(`server is listening on ${port} !!!`);
});
