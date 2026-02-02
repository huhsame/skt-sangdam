-- pgvector 확장 활성화
create extension if not exists vector;

-- 문서 테이블
create table documents (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  total_pages int not null,
  uploaded_at timestamptz not null default now(),
  status text not null default 'processing'
    check (status in ('processing', 'ready', 'error'))
);

-- 문서 페이지 테이블
create table document_pages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  page_number int not null,
  content text not null,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  unique (document_id, page_number)
);

-- 벡터 검색을 위한 인덱스
create index on document_pages using ivfflat (embedding vector_cosine_ops)
  with (lists = 10);

-- 시맨틱 검색 함수
create or replace function match_pages(
  query_embedding vector(1536),
  match_threshold float default 0.3,
  match_count int default 5
)
returns table (
  id uuid,
  document_id uuid,
  page_number int,
  content text,
  filename text,
  similarity float
)
language plpgsql as $$
begin
  return query
  select
    dp.id,
    dp.document_id,
    dp.page_number,
    dp.content,
    d.filename,
    1 - (dp.embedding <=> query_embedding) as similarity
  from document_pages dp
  join documents d on d.id = dp.document_id
  where dp.embedding is not null
    and 1 - (dp.embedding <=> query_embedding) > match_threshold
  order by dp.embedding <=> query_embedding
  limit match_count;
end;
$$;
