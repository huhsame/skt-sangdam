import { getSupabase } from "@/lib/supabase";

const CARRIER = process.env.NEXT_PUBLIC_CARRIER ?? "lguplus";

export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("sangdam_documents")
    .select("id, filename, total_pages, uploaded_at, status, carrier")
    .eq("carrier", CARRIER)
    .order("uploaded_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
