"use client";

import type { SearchResult } from "@/types/manual";

interface SearchResultsProps {
  results: SearchResult[];
  selectedId: string | null;
  onSelect: (result: SearchResult) => void;
}

export default function SearchResults({ results, selectedId, onSelect }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <ul className="divide-y divide-gray-100">
      {results.map((result) => {
        const pct = Math.round(result.similarity * 100);
        const isSelected = selectedId === result.id;

        return (
          <li key={result.id}>
            <button
              onClick={() => onSelect(result)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                isSelected ? "bg-red-50 border-l-4 border-[#E4002B]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">
                    {result.filename}
                    <span className="ml-1">· p.{result.page_number}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {result.content.slice(0, 80)}
                    {result.content.length > 80 && "..."}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                    pct >= 70
                      ? "bg-green-100 text-green-700"
                      : pct >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {pct}%
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
