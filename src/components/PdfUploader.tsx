"use client";

import { useState, useRef } from "react";
import type { UploadProgress } from "@/types/manual";

interface PdfUploaderProps {
  onComplete: () => void;
}

export default function PdfUploader({ onComplete }: PdfUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok || !response.body) {
        setError("업로드 요청 실패");
        setIsUploading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line) as UploadProgress;
            setProgress(data);

            if (data.type === "error") {
              setError(data.message ?? "업로드 중 오류 발생");
              setIsUploading(false);
              if (fileInputRef.current) fileInputRef.current.value = "";
              return;
            }

            if (data.type === "complete") {
              setIsUploading(false);
              if (fileInputRef.current) fileInputRef.current.value = "";
              onComplete();
              return;
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".pdf")) handleUpload(file);
    else setError("PDF 파일만 업로드 가능합니다.");
  };

  const pct = progress?.current && progress?.total
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="p-4 border-b border-gray-200">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); !isUploading && fileInputRef.current?.click(); } }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isUploading
            ? "border-gray-300 bg-gray-50 cursor-default"
            : "border-gray-300 hover:border-[#E6007E] hover:bg-red-50 cursor-pointer"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        {isUploading ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              처리 중... ({progress?.current ?? 0}/{progress?.total ?? "?"} 페이지)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#E6007E] h-2 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{pct}%</p>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-8 w-8 text-gray-400 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16v-8m0 0l-3 3m3-3l3 3M6.75 19.25h10.5A2.25 2.25 0 0019.5 17V7a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 7v10a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <p className="text-sm text-gray-500">PDF 파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-xs text-gray-400 mt-0.5">최대 50MB</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}

      {progress?.type === "complete" && (
        <p className="text-xs text-green-600 mt-2">업로드 완료!</p>
      )}
    </div>
  );
}
