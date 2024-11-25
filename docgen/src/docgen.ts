/// <reference path="./types.d.ts" />
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import DocxMerger from "docx-merger";
import fs from "fs";
import path from "path";

export default async function generateDoc(
  contractor: string,
  date: string,
  count: number
): Promise<Blob> {
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

  // FIXME: 解決合併後的檔案損毀原因

  fs.existsSync(path.resolve(__dirname, "../outputs")) ||
    fs.mkdirSync(path.resolve(__dirname, "../outputs"));

  for (let i = 0; i < Math.ceil(count / 24); i++) {
    const fileName =
      Math.ceil(count / 24) === 1
        ? `${contractor}_${date}.docx`
        : `${contractor}_${date}_${i + 1}.docx`;
    fs.writeFileSync(path.resolve(__dirname, `../outputs/${fileName}`), buf);
  }

  if (Math.ceil(count / 24) === 1) {
    return new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });
  }

  const docx = new DocxMerger({}, Array(Math.ceil(count / 24)).fill(buf));
  // unit8array, arraybuffer, blob, nodebuffer, base64
  docx.save("uint8array", (data) => {
    fs.writeFileSync(
      path.resolve(__dirname, `../outputs/${contractor}_${date}.docx`),
      data
    );
  });

  return new Blob(
    [
      await fs.openAsBlob(
        path.resolve(__dirname, `../outputs/${contractor}_${date}.docx`)
      )
    ],
    {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
  );
}
