import puppeteer, { Browser } from "puppeteer";

let _browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (_browser && _browser.connected) {
    return _browser;
  }
  _browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });
  return _browser;
}

/**
 * PDF 페이지를 PNG 이미지 Buffer로 렌더링
 * @param pdfBuffer - PDF 파일의 Buffer
 * @param pageNumber - 렌더링할 페이지 번호 (1-based)
 * @param scale - 렌더링 스케일 (기본 2)
 */
export async function renderPdfPageToImage(
  pdfBuffer: Buffer,
  pageNumber: number,
  scale = 2,
): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    const base64Pdf = pdfBuffer.toString("base64");

    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { background: white; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.min.mjs" type="module"></script>
  <script type="module">
    const pdfjsLib = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.min.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs";

    const pdfData = Uint8Array.from(atob("${base64Pdf}"), c => c.charCodeAt(0));
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const pg = await pdf.getPage(${pageNumber});

    const viewport = pg.getViewport({ scale: ${scale} });
    const canvas = document.getElementById("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    await pg.render({ canvasContext: ctx, viewport }).promise;

    document.title = "DONE";
  </script>
</body>
</html>`;

    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.title === "DONE", {
      timeout: 30_000,
    });

    const canvas = await page.$("#canvas");
    if (!canvas) throw new Error("Canvas element not found");

    const screenshot = await canvas.screenshot({ type: "png" });
    return Buffer.from(screenshot);
  } finally {
    await page.close();
  }
}

/**
 * 브라우저 인스턴스 정리 (프로세스 종료 시 호출)
 */
export async function closeBrowser(): Promise<void> {
  if (_browser) {
    await _browser.close();
    _browser = null;
  }
}
