import { workerTypes } from "@/types";

const host = import.meta.env.DEV
  ? "http://localhost:8011"
  : "https://monday-docgen.ngrok.io";
async function fetchGenerateDoc(
  name: string,
  date: string,
  count: number,
  workerType?: workerTypes
): Promise<Response> {
  try {
    const response = await fetch(`${host}/generate-doc`, {
      method: "POST",
      body: JSON.stringify({ name, date, count }),
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*"
      }
    });

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
async function fetchPackedFiles(files: File[]): Promise<Response> {
  try {
    const response = await fetch(`${host}/pack`, {
      method: "POST",
      body: JSON.stringify({ files }),
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*"
      }
    });

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

class File {
  private _docBlob?: Blob | null = null;
  private _url?: string | null = null;
  static files: File[] = [];
  static packedfilesURL: string | null = null;

  constructor(public name: string, public date: string, public count: number) {
    this.name = name;
    this.date = date;
    this.count = count;
    File.files.push(this);
  }

  async generate(): Promise<this> {
    try {
      const res = await fetchGenerateDoc(this.name, this.date, this.count);
      this._docBlob = await res.blob();
      return this;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  getFileURL(): string {
    if (!this._docBlob) {
      throw new Error(
        "File not generated. Be sure call the 'generate' method first"
      );
    }
    this._url = URL.createObjectURL(this._docBlob);
    return this._url;
  }

  static getPackFileURL(): string {
    if (!File.packedfilesURL) {
      throw new Error(
        "File not generated. Be sure call the 'pack' method first"
      );
    }
    return File.packedfilesURL;
  }

  async getFile(): Promise<Buffer> {
    if (!this._docBlob) {
      throw new Error(
        "File not generated. Be sure call the 'generate' method first"
      );
    }
    return Buffer.from(await this._docBlob.arrayBuffer());
  }

  static async pack(): Promise<void> {
    try {
      const res = await fetchPackedFiles(File.files);
      File.packedfilesURL = URL.createObjectURL(await res.blob());
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async generateDocs(files: File[]): Promise<void> {
    await Promise.all(files.map(async (file) => await file.generate()));
  }

  static release(): void {
    File.files = [];
  }

  static async downloadFiles(date: string): Promise<void> {
    try {
      await File.generateDocs(File.files);
      await File.pack();
      const url = File.getPackFileURL();

      // Create a link element to download the zip file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `危害告知單_${date}.zip`);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      File.release();
    } catch (error) {
      console.error(error);
    }
  }
}
export default File;
