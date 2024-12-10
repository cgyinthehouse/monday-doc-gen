import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { glob } from "node:fs/promises";
import fs from "fs";
import { expect, test } from "vitest";

async function getContents(): Promise<Buffer> {
  try {
    const zip = new PizZip();
    for await (const file of glob("*.docx", { cwd: "./outputs" })) {
      zip.file(file, fs.readFileSync(`./outputs/${file}`));
    }
    const contents: Buffer = zip.generate({
      type: "nodebuffer",
      compression: "DEFLATE"
    });
    return contents;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

function mergedocs(contents: Buffer): Buffer {
  const mergedoc = new PizZip();
  contents.forEach((content, index) => {
    const doc = new Docxtemplater(content);
    const docText = doc.getFullText();
    mergedoc.file(`word/document${index}.xml`, docText);
  });
  const output = mergedoc.generate({
    type: "nodebuffer",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });

  return output;
}

test("should merge docs", async () => {
  const contents = await getContents();
  fs.writeFileSync("./outputs/merged.docx", mergedocs(contents));
  expect(fs.existsSync("./outputs/merged.docx")).toBe(true);
});
