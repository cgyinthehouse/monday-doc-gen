import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";

export default async function generateDoc(
  contractor: string,
  date: string,
  count: number
): Promise<Blob> {
  let file = "2.危害因素告知單.docx";
  const CELLS_PER_PAGE = 24;
  const pages = Math.ceil(count / CELLS_PER_PAGE);

  switch (pages) {
    case 1:
      break;
    case 2:
      file = "2.危害因素告知單-2.docx";
      break;
    case 3:
      file = "2.危害因素告知單-3.docx";
      break;
    case 4:
      file = "2.危害因素告知單-4.docx";
    default:
      throw new Error("page exceed");
  }
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

  fs.existsSync(path.resolve(__dirname, "../outputs")) ||
    fs.mkdirSync(path.resolve(__dirname, "../outputs"));

  // Get the document as a zip (docx are zipped files)
  // and generate it as a Node.js buffer
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    // Compression: DEFLATE adds a compression step.
    // For a 50MB document, expect 500ms additional CPU time.
    compression: "DEFLATE"
  });

  fs.writeFileSync(
    path.resolve(__dirname, `../outputs/${contractor}_${date}.docx`),
    buf
  );

  return new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
}
