import fs from "fs";
import path from "path";
import cleaner from "../cleaner";
import { expect, test } from "vitest";
const outputFolder = path.resolve(__dirname, "../../outputs");

// FIXME: why the fuck the file didn't get deleted
test("should remove files older than today", () => {
  const oldFile = "佑晨_2024-12-05.docx";
  cleaner();

  // Check if the test file has been removed
  expect(fs.existsSync(path.join(outputFolder, oldFile))).toBe(false);
});

test("should not remove files from today", async () => {
  const testFile = "佑晨_2024-12-06.docx";
  cleaner();

  // Check if the test file still exists
  expect(fs.existsSync(path.join(outputFolder, testFile))).toBe(true);
});
