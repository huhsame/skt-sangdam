# 프로젝트 개요

AI 기반 고객센터 상담 매뉴얼 검색 + CRM 자동화 시스템.
통신사 2개 버전을 **브랜치로 분리**해서 관리한다.

## 브랜치 전략

| 브랜치 | 통신사 | 배포 URL | 브랜드 색상 |
|--------|--------|----------|-------------|
| `main` | SKT | https://skt-sangdam.vercel.app | `#E4002B` |
| `lguplus` | LG U+ | https://lguplus-sangdam.vercel.app | `#E6007E` |

- SKT 작업 → `main` 브랜치에서
- LG U+ 작업 → `lguplus` 브랜치에서
- 배포는 각 브랜치에서 `vercel deploy --prod --yes`

## 주요 파일

| 파일 | 역할 |
|------|------|
| `src/lib/crm-dummy-data.ts` | CRM 화면에 표시되는 고객/상품 더미데이터 |
| `data/manual.md` | 상담 매뉴얼 원본 (마크다운) |
| `data/manual_sections.json` | 매뉴얼 섹션별 메타데이터 (Supabase 임베딩용) |
| `generate-pdf-skt.js` | SKT 버전 PDF 생성 |
| `generate-pdf-lguplus.js` | LG U+ 버전 PDF 생성 |
| `generate-pdf.js` | 현재 브랜치 기준 PDF 생성 |

## 통신사별 브랜드 대응표

| 항목 | SKT (`main`) | LG U+ (`lguplus`) |
|------|-------------|-------------------|
| 요금제 | T플랜 에센셜/스페셜/프리미엄 | 5G 시그니처 에센셜/스페셜/시그니처 |
| 청년요금제 | 0 청년 요금제 | 유쓰 라이트 |
| 로밍 | baro 로밍 | U+ 로밍 |
| 보험 | T안심보험 | U+안심보험 |
| 멤버십 | T멤버십 | U+멤버십 |
| 데이터부가 | T 데이터 리필 쿠폰 | 데이터 리필 쿠폰 |

## PDF 생성

```bash
node generate-pdf-skt.js      # SKT → data/manual.pdf
node generate-pdf-lguplus.js  # LG U+ → data/manual.pdf
```
