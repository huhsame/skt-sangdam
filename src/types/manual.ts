export interface Document {
  id: string;
  filename: string;
  total_pages: number;
  uploaded_at: string;
  status: "processing" | "ready" | "error";
}

export interface DocumentPage {
  id: string;
  document_id: string;
  page_number: number;
  content: string;
  embedding?: number[];
  image_url?: string | null;
  created_at: string;
}

export interface SearchResult {
  id: string;
  document_id: string;
  page_number: number;
  content: string;
  filename: string;
  similarity: number;
  image_url?: string | null;
}

export interface UploadProgress {
  type: "progress" | "complete" | "error";
  current?: number;
  total?: number;
  documentId?: string;
  message?: string;
}
