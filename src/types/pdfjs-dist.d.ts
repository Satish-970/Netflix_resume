declare module 'pdfjs-dist/build/pdf' {
  interface PdfTextItem {
    str?: string;
  }

  declare module 'pdfjs-dist/build/pdf.worker.entry' {
    const worker: unknown;
    export = worker;
  }

  interface PdfPage {
    getTextContent: () => Promise<{ items: PdfTextItem[] }>;
  }

  interface PdfDocument {
    numPages: number;
    getPage: (pageNumber: number) => Promise<PdfPage>;
  }

  export function getDocument(options: {
    data: ArrayBuffer;
    disableWorker?: boolean;
  }): { promise: Promise<PdfDocument> };
}
