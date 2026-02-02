import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = getSupabase();

  // 1. Storage에서 해당 문서의 페이지 이미지 폴더 삭제
  const { data: files } = await supabase.storage
    .from("page-images")
    .list(id);

  if (files && files.length > 0) {
    const paths = files.map((f) => `${id}/${f.name}`);
    await supabase.storage.from("page-images").remove(paths);
  }

  // 2. documents 삭제 (CASCADE로 document_pages도 삭제됨)
  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
