import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";
import { Blob } from "buffer";

export default function generateDoc(
  contractor: string,
  date: string,
  count: number
): Blob {
  const file = "2.危害因素告知單.docx";

  // Load the docx file as binary content
  const content = fs.readFileSync(
    path.resolve(__dirname, `../templates/${file}`),
    "binary"
  );

  // Unzip the content of the file
  const zip = new PizZip(content);

  // Parse the template.
  // This function throws an error if the template is invalid,
  // for example, if the template is "Hello {user" (missing closing tag)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true
  });

  const parsedDate = /(\d+)\-(\d+)\-(\d+)/.exec(date);
  const [, y, m, d] = parsedDate ? [...parsedDate] : ["", "", ""];
  doc.render({
    contractor,
    year: y,
    month: m,
    date: d,
    count
  });

  // Get the document as a zip (docx are zipped files)
  // and generate it as a Node.js buffer
  const buf = doc.getZip().generate({
    type: "uint8array",
    // Compression: DEFLATE adds a compression step.
    // For a 50MB document, expect 500ms additional CPU time.
    compression: "DEFLATE"
  });

  // Write the Node.js Buffer to a file
  // Instead of writing it to a file, you could also
  // let the user downloa

 // TODO: 依照人數動態生成多頁文件

  fs.writeFileSync(path.resolve(__dirname, `../outputs/${contractor}_${date}.docx`), buf);

  return new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
}
