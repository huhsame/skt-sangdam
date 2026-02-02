import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface PdfPage {
  pageNumber: number;
  text: string;
}

const MIN_PAGE_LENGTH = 50;

// Disable worker thread — run PDF parsing on the main thread (server-side only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(GlobalWorkerOptions as any).workerPort = null;

/**
 * PDF 파일을 페이지별 텍스트로 파싱
 */
export async function parsePdf(buffer: ArrayBuffer): Promise<PdfPage[]> {
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;
  const pages: PdfPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length >= MIN_PAGE_LENGTH) {
      pages.push({ pageNumber: i, text });
    }
  }

  return pages;
}

/**
 * PDF 총 페이지 수 반환
 */
export async function getPdfPageCount(buffer: ArrayBuffer): Promise<number> {
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;
  return pdf.numPages;
}
