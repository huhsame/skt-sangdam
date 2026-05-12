import puppeteer, { type Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

// Vercel/Lambda용 chromium 외부 pack (@sparticuz/chromium-min 148 ↔ Chrome 148)
const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v148.0.0/chromium-v148.0.0-pack.x64.tar";

let _browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (_browser && _browser.connected) {
    return _browser;
  }
  if (process.env.VERCEL) {
    _browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: true,
    });
  } else {
    _browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.platform === "darwin"
          ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          : "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });
  }
  return _browser;
}

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

export async function closeBrowser(): Promise<void> {
  if (_browser) {
    await _browser.close();
    _browser = null;
  }
}
