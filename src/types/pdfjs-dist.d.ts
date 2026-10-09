declare module 'pdfjs-dist/build/pdf' {
  interface PdfTextItem {
    str?: string;
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
