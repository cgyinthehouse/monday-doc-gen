declare module "docx-merger" {
  import JSZip from "jszip"; // Assuming JSZip is imported or available as a dependency.

  interface DocxMergerOptions {
    style?: string;
    pageBreak?: boolean;
  }

  class DocxMerger {
    private _body: string[];
    private _header: string[];
    private _footer: string[];
    private _Basestyle: string;
    private _style: any[]; // Replace `any[]` with a more specific type if available
    private _numbering: any[]; // Replace `any[]` with a more specific type if available
    private _pageBreak: boolean;
    private _files: JSZip[];
    private _contentTypes: Record<string, any>; // Replace `any` with a more specific type if available
    private _media: Record<string, any>; // Replace `any` with a more specific type if available
    private _rel: Record<string, any>; // Replace `any` with a more specific type if available
    private _builder: string[];

    constructor(options: DocxMergerOptions, files: any[]);

    insertPageBreak(): void;
    insertRaw(xml: string): void;
    mergeBody(files: JSZip[]): void;
    save(type: string, callback: (data: any) => void): void;
  }

  export default DocxMerger;
}
