const host = import.meta.env.DEV
  ? "http://localhost:8011"
  : "https://monday-docgen.ngrok.io";
async function generateDoc(
  name: string,
  date: string,
  count: number
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

async function packFiles(files: File[]): Promise<Response> {
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
      const res = await generateDoc(this.name, this.date, this.count);
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
  static async pack() {
    try {
      const res = await packFiles(File.files);
      File.packedfilesURL = URL.createObjectURL(await res.blob());
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async generateDocs(files: File[]) {
    await Promise.all(files.map(async (file) => await file.generate()));
  }

  static relase() {
    File.files = [];
  }
}
export default File;
