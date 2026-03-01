"use client";

import type { SearchResult } from "@/types/manual";

interface ContentViewerProps {
  section: SearchResult | null;
}

export default function ContentViewer({ section }: ContentViewerProps) {
  if (!section) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">검색 결과를 선택하면 내용이 표시됩니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-white bg-[#E6007E] px-2 py-0.5 rounded">
              {section.filename}
            </span>
            <span className="text-xs text-gray-500">p.{section.page_number}</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                Math.round(section.similarity * 100) >= 70
                  ? "bg-green-100 text-green-700"
                  : Math.round(section.similarity * 100) >= 50
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {Math.round(section.similarity * 100)}% 일치
            </span>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="mb-6 border-gray-200" />

        {/* 콘텐츠 */}
        {section.image_url ? (
          <div className="flex justify-center">
            <img
              src={section.image_url}
              alt={`${section.filename} - 페이지 ${section.page_number}`}
              className="max-w-full h-auto rounded shadow-sm border border-gray-200"
            />
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {section.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
