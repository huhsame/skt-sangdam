"use client";

import { useState, useEffect, useCallback } from "react";
import type { Document } from "@/types/manual";

interface DocumentListProps {
  refreshKey: number;
  onDeleted: () => void;
}

export default function DocumentList({ refreshKey, onDeleted }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        setDocuments(await res.json());
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshKey]);

  const handleDelete = async (doc: Document) => {
    if (!confirm(`"${doc.filename}" 문서를 삭제하시겠습니까?\n관련된 모든 페이지와 이미지가 함께 삭제됩니다.`)) {
      return;
    }

    setDeleting(doc.id);
    try {
      const res = await fetch(`/api/documents/${doc.id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
        onDeleted();
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  if (documents.length === 0) return null;

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        업로드된 문서
      </h3>
      <ul className="space-y-1.5">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800 truncate">{doc.filename}</p>
              <p className="text-xs text-gray-400">
                {doc.total_pages}p
                {doc.status === "processing" && (
                  <span className="ml-1.5 text-amber-500">처리 중...</span>
                )}
              </p>
            </div>
            <button
              onClick={() => handleDelete(doc)}
              disabled={deleting === doc.id}
              className="shrink-0 p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="삭제"
            >
              {deleting === doc.id ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
