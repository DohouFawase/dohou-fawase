alter table public.projects
  add column if not exists title_en text,
  add column if not exists description_en text;
