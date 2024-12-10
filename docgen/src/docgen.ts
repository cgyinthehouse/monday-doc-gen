import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";

const workerTypes = [
  "粗工",
  "鋼構工",
  "清潔工",
  "泵送工",
  "石材工",
  "防水工",
  "鋼筋工",
  "電銲工",
  "門窗工",
  "測量工",
  "外籍工作者",
  "油漆工",
  "模板工",
  "裝修工",
  "機械工",
  "泥做工",
  "電梯工",
  "鷹架工",
  "西工",
  "水電工"
] as const;

export default async function generateDoc(
  contractor: string,
  date: string,
  count: number,
  workerType: (typeof workerTypes)[number]
): Promise<Blob> {
  let file: string;
  const CELLS_PER_PAGE = 24;
  const pages = Math.ceil(count / CELLS_PER_PAGE);

  if (pages > 4) {
    throw new Error("Maximum of 4 pages is only supported");
  } else if (pages > 1) {
    file = `2.危害因素告知單-${pages}.docx`;
  } else {
    file = "2.危害因素告知單.docx";
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
    count,
    workerType
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
    path.resolve(
      __dirname,
      `../outputs/${contractor}_${workerType}_${date}.docx`
    ),
    buf
  );

  return new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
}
