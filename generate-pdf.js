const puppeteer = require('puppeteer');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const mdContent = fs.readFileSync(path.join(__dirname, 'data', 'manual.md'), 'utf-8');

// marked 설정
marked.setOptions({
  gfm: true,
  breaks: false,
});

const htmlBody = marked.parse(mdContent);

const fullHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  @page {
    size: A4;
    margin: 25mm 20mm 30mm 20mm;
  }

  @page :first {
    margin-top: 0;
    margin-bottom: 0;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", sans-serif;
    font-size: 10pt;
    line-height: 1.7;
    color: #1a1a1a;
    counter-reset: page-num;
  }

  /* ===== 표지 ===== */
  .cover-page {
    page-break-after: always;
    height: 297mm;
    width: 210mm;
    margin: -25mm -20mm;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(160deg, #E4002B 0%, #B80025 40%, #8C001D 100%);
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .cover-page::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -10%;
    width: 60%;
    height: 60%;
    background: rgba(255,255,255,0.03);
    border-radius: 50%;
  }

  .cover-page::after {
    content: '';
    position: absolute;
    bottom: -15%;
    left: -15%;
    width: 70%;
    height: 70%;
    background: rgba(255,255,255,0.02);
    border-radius: 50%;
  }

  .cover-logo {
    font-size: 18pt;
    font-weight: 300;
    letter-spacing: 8px;
    text-transform: uppercase;
    margin-bottom: 10mm;
    opacity: 0.9;
  }

  .cover-divider {
    width: 60mm;
    height: 1px;
    background: rgba(255,255,255,0.4);
    margin: 8mm 0;
  }

  .cover-title {
    font-size: 32pt;
    font-weight: 800;
    letter-spacing: 2px;
    margin-bottom: 5mm;
    text-shadow: 0 2px 20px rgba(0,0,0,0.2);
  }

  .cover-subtitle {
    font-size: 14pt;
    font-weight: 300;
    opacity: 0.85;
    margin-bottom: 15mm;
    letter-spacing: 3px;
  }

  .cover-meta {
    position: absolute;
    bottom: 30mm;
    text-align: center;
    font-size: 9pt;
    opacity: 0.7;
    line-height: 2;
  }

  .cover-badge {
    display: inline-block;
    border: 1px solid rgba(255,255,255,0.5);
    padding: 3mm 8mm;
    border-radius: 2px;
    font-size: 9pt;
    letter-spacing: 3px;
    margin-bottom: 8mm;
  }

  /* ===== 목차 페이지 ===== */
  .toc-page {
    page-break-after: always;
    padding-top: 10mm;
  }

  .toc-page h2 {
    font-size: 20pt;
    color: #E4002B;
    border-bottom: 3px solid #E4002B;
    padding-bottom: 4mm;
    margin-bottom: 8mm;
    letter-spacing: 2px;
  }

  .toc-chapter {
    margin-bottom: 5mm;
  }

  .toc-chapter-title {
    font-size: 11pt;
    font-weight: 700;
    color: #1a1a1a;
    padding: 2mm 0;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
  }

  .toc-chapter-title .page-ref {
    color: #888;
    font-weight: 400;
    font-size: 9pt;
  }

  .toc-section {
    font-size: 9.5pt;
    color: #555;
    padding: 1mm 0 1mm 6mm;
    display: flex;
    justify-content: space-between;
  }

  .toc-section .dots {
    flex: 1;
    border-bottom: 1px dotted #ccc;
    margin: 0 3mm;
    position: relative;
    top: -2mm;
  }

  /* ===== 본문 스타일 ===== */

  /* H1: 챕터 제목 - 항상 새 페이지 */
  h1 {
    font-size: 22pt;
    font-weight: 800;
    color: #E4002B;
    page-break-before: always;
    margin-top: 0;
    padding-top: 15mm;
    padding-bottom: 5mm;
    border-bottom: 3px solid #E4002B;
    margin-bottom: 8mm;
    letter-spacing: 1px;
  }

  /* 첫 번째 H1 (문서 제목)은 숨김 - 표지로 대체 */
  h1:first-of-type {
    display: none;
  }

  /* H2: 섹션 제목 */
  h2 {
    font-size: 15pt;
    font-weight: 700;
    color: #2c2c2c;
    margin-top: 10mm;
    margin-bottom: 4mm;
    padding-bottom: 2mm;
    border-bottom: 2px solid #f0f0f0;
    page-break-after: avoid;
  }

  /* H3: 소제목 */
  h3 {
    font-size: 12pt;
    font-weight: 700;
    color: #444;
    margin-top: 6mm;
    margin-bottom: 3mm;
    page-break-after: avoid;
  }

  h4 {
    font-size: 10.5pt;
    font-weight: 600;
    color: #555;
    margin-top: 4mm;
    margin-bottom: 2mm;
  }

  /* 단락 */
  p {
    margin: 2mm 0;
    text-align: justify;
    word-break: keep-all;
  }

  /* 테이블 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 4mm 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }

  thead {
    background: #E4002B;
    color: white;
  }

  thead th {
    padding: 2.5mm 3mm;
    text-align: left;
    font-weight: 600;
    font-size: 8.5pt;
    letter-spacing: 0.5px;
    border: none;
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid #e8e8e8;
  }

  tbody tr:nth-child(even) {
    background: #fafafa;
  }

  tbody tr:hover {
    background: #fff5f5;
  }

  td {
    padding: 2mm 3mm;
    vertical-align: top;
    border: none;
  }

  /* 코드 블록 (멘트/스크립트) */
  pre {
    background: #f8f9fa;
    border-left: 4px solid #E4002B;
    padding: 4mm 5mm;
    margin: 4mm 0;
    border-radius: 0 4px 4px 0;
    font-size: 8.5pt;
    line-height: 1.6;
    overflow-x: auto;
    page-break-inside: avoid;
  }

  code {
    font-family: "SF Mono", "Monaco", "Menlo", "Consolas", monospace;
    font-size: 8.5pt;
  }

  p code, li code {
    background: #f0f0f0;
    padding: 0.5mm 2mm;
    border-radius: 2px;
    font-size: 8.5pt;
    color: #c7254e;
  }

  /* 인용문 (상담 TIP 등) */
  blockquote {
    background: #FFF8E1;
    border-left: 4px solid #FFB300;
    padding: 3mm 5mm;
    margin: 4mm 0;
    border-radius: 0 4px 4px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }

  blockquote strong {
    color: #E65100;
  }

  blockquote p {
    margin: 1mm 0;
  }

  /* 리스트 */
  ul, ol {
    margin: 2mm 0;
    padding-left: 6mm;
  }

  li {
    margin: 1mm 0;
  }

  /* 수평선 */
  hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 6mm 0;
  }

  /* 강조 */
  strong {
    font-weight: 700;
    color: #1a1a1a;
  }

  em {
    font-style: italic;
    color: #555;
  }

  /* 경고 아이콘 */
  blockquote p:first-child strong:first-child {
    color: #E65100;
  }

  /* 페이지 헤더/푸터 - Puppeteer로 처리 */

  /* 인쇄 최적화 */
  h1, h2, h3, h4 {
    page-break-after: avoid;
  }

  table, pre, blockquote {
    page-break-inside: avoid;
  }

  /* 숨겨진 메타 정보 (마크다운 초반부) - 표지 대체 */
  body > blockquote:first-of-type {
    display: none;
  }

  /* ===== 기타 ===== */
  .page-break {
    page-break-before: always;
  }

  /* 마지막 저작권 문구 */
  body > p:last-of-type em {
    font-size: 8pt;
    color: #999;
  }

</style>
</head>
<body>

<!-- 표지 -->
<div class="cover-page">
  <div class="cover-logo">TELECOM</div>
  <div class="cover-divider"></div>
  <div class="cover-title">고객센터<br>상담 매뉴얼</div>
  <div class="cover-subtitle">모바일 통신 서비스</div>
  <div class="cover-badge">대 외 비</div>
  <div class="cover-meta">
    <div>버전 2025.01 | 최종 수정일 2025-01-15</div>
    <div>배포 대상: 고객센터 상담원 전원</div>
    <div style="margin-top: 3mm;">통신사 고객서비스본부</div>
  </div>
</div>

<!-- 목차 -->
<div class="toc-page">
  <h2 style="page-break-before: avoid;">목 차</h2>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제1장. 상담 기본<span class="page-ref">p.3</span></div>
    <div class="toc-section">1.1 상담원 기본 수칙 및 응대 매너</div>
    <div class="toc-section">1.2 전화 응대 표준 멘트</div>
    <div class="toc-section">1.3 본인확인 절차</div>
    <div class="toc-section">1.4 개인정보 보호 및 고객정보 조회 기준</div>
  </div>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제2장. 요금제 안내 및 변경<span class="page-ref">p.7</span></div>
    <div class="toc-section">2.1 5G 요금제 라인업</div>
    <div class="toc-section">2.2 LTE 요금제 라인업</div>
    <div class="toc-section">2.3 시니어/청소년/어린이 전용 요금제</div>
    <div class="toc-section">2.4 데이터 중심 요금제 (0 플랜 시리즈)</div>
    <div class="toc-section">2.5 요금제 변경 처리 절차</div>
    <div class="toc-section">2.6 요금제 변경 시 주의사항</div>
    <div class="toc-section">2.7 요금제 비교 상담 가이드</div>
  </div>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제3장. 요금/청구/납부<span class="page-ref">p.15</span></div>
    <div class="toc-section">3.1 요금 청구 구조</div>
    <div class="toc-section">3.2 요금 조회 및 상세 안내 방법</div>
    <div class="toc-section">3.3 납부 방법</div>
    <div class="toc-section">3.4 미납/연체 처리 및 이용정지 기준</div>
    <div class="toc-section">3.5 요금 감면 제도</div>
    <div class="toc-section">3.6 요금 이의신청 및 환불 처리</div>
    <div class="toc-section">3.7 소액결제/콘텐츠이용료 관련 문의</div>
  </div>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제4장. 부가서비스<span class="page-ref">p.22</span></div>
    <div class="toc-section">4.1 데이터 관련 서비스</div>
    <div class="toc-section">4.2 통화/문자 관련 서비스</div>
    <div class="toc-section">4.3 보험/보장 서비스</div>
    <div class="toc-section">4.4 구독형 서비스</div>
    <div class="toc-section">4.5 멤버십/혜택</div>
    <div class="toc-section">4.6 부가서비스 가입/해지 처리 절차</div>
  </div>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제5장. 기기 관련<span class="page-ref">p.28</span></div>
    <div class="toc-section">5.1 신규가입 절차 및 구비서류</div>
    <div class="toc-section">5.2 기기변경 절차</div>
    <div class="toc-section">5.3 번호이동(MNP) 전입/전출 처리</div>
    <div class="toc-section">5.4 약정/할부 안내</div>
    <div class="toc-section">5.5 중고폰/자급제폰 개통 처리</div>
    <div class="toc-section">5.6 eSIM 개통 및 관리</div>
    <div class="toc-section">5.7 분실/습득 신고 처리</div>
  </div>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제6장. 로밍 서비스<span class="page-ref">p.35</span></div>
    <div class="toc-section">6.1 자동로밍 안내</div>
    <div class="toc-section">6.2 로밍 요금제</div>
    <div class="toc-section">6.3 로밍 데이터 차단/해제</div>
    <div class="toc-section">6.4 로밍 요금 관련 주의사항</div>
    <div class="toc-section">6.5 귀국 후 로밍 요금 정산</div>
  </div>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제7장. 부가 업무<span class="page-ref">p.39</span></div>
    <div class="toc-section">7.1 명의변경</div>
    <div class="toc-section">7.2 일시정지/재개통</div>
    <div class="toc-section">7.3 해지 처리 및 해지방어 가이드</div>
    <div class="toc-section">7.4 번호변경</div>
    <div class="toc-section">7.5 청구서 주소/수단 변경</div>
    <div class="toc-section">7.6 위임장 처리 기준</div>
  </div>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제8장. 네트워크/품질 관련<span class="page-ref">p.44</span></div>
    <div class="toc-section">8.1 통화품질 불량 신고 접수</div>
    <div class="toc-section">8.2 데이터 속도저하 문의 대응</div>
    <div class="toc-section">8.3 기지국/커버리지 관련 안내</div>
    <div class="toc-section">8.4 장애 발생 시 대응 매뉴얼</div>
  </div>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제9장. 고객 불만/VOC 처리<span class="page-ref">p.47</span></div>
    <div class="toc-section">9.1 불만 등급별 처리 기준</div>
    <div class="toc-section">9.2 에스컬레이션 절차</div>
    <div class="toc-section">9.3 보상 정책 및 처리 권한</div>
    <div class="toc-section">9.4 민원 접수 대응</div>
  </div>

  <div class="toc-chapter">
    <div class="toc-chapter-title">제10장. 부록<span class="page-ref">p.50</span></div>
    <div class="toc-section">10.1 자주 묻는 질문(FAQ) 요약</div>
    <div class="toc-section">10.2 내부 시스템 코드 및 업무 단축키</div>
    <div class="toc-section">10.3 유관부서 연락처</div>
  </div>
</div>

<!-- 본문 -->
${htmlBody}

</body>
</html>`;

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log('Loading HTML content...');
  await page.setContent(fullHTML, { waitUntil: 'networkidle0' });

  const outputPath = path.join(__dirname, 'data', 'manual.pdf');

  console.log('Generating PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '25mm',
      bottom: '30mm',
      left: '20mm',
      right: '20mm',
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; font-size: 7pt; color: #999; padding: 0 15mm; display: flex; justify-content: space-between; font-family: -apple-system, sans-serif;">
        <span>통신사 고객센터 상담 매뉴얼</span>
        <span style="color: #E4002B; font-weight: 600;">대외비</span>
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; font-size: 7pt; color: #999; padding: 0 15mm; display: flex; justify-content: space-between; font-family: -apple-system, sans-serif;">
        <span>© 2025 통신사</span>
        <span>- <span class="pageNumber"></span> -</span>
        <span>v2025.01</span>
      </div>
    `,
  });

  console.log(`PDF generated: ${outputPath}`);

  await browser.close();
  console.log('Done!');
})();
