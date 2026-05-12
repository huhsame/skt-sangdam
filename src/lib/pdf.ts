export interface PdfPage {
  pageNumber: number;
  text: string;
}

const MIN_PAGE_LENGTH = 50;

/**
 * Vercel 서버리스 환경에 없는 브라우저 전역 객체 폴리필
 * pdfjs-dist 모듈 로드 전에 반드시 실행되어야 함
 */
function ensurePolyfills() {
  if (typeof globalThis.DOMMatrix === "undefined") {
    // @ts-expect-error - pdfjs-dist 텍스트 추출용 최소 스텁
    globalThis.DOMMatrix = class DOMMatrix {};
  }
  if (typeof globalThis.ImageData === "undefined") {
    // @ts-expect-error - 최소 스텁
    globalThis.ImageData = class ImageData {};
  }
  if (typeof globalThis.Path2D === "undefined") {
    // @ts-expect-error - 최소 스텁
    globalThis.Path2D = class Path2D {};
  }
}

async function loadPdfjs() {
  ensurePolyfills();
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // serverless: workerSrc는 URL 형식 필수 (path는 'Invalid workerSrc type' 에러)
  const { createRequire } = await import("module");
  const { pathToFileURL } = await import("url");
  const require = createRequire(import.meta.url);
  const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).toString();
  return pdfjs;
}

/**
 * PDF 파일을 페이지별 텍스트로 파싱
 */
export async function parsePdf(buffer: ArrayBuffer): Promise<PdfPage[]> {
  const { getDocument } = await loadPdfjs();
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
  const { getDocument } = await loadPdfjs();
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;
  return pdf.numPages;
}
