-- Media Vault — Schema Criptografado na Nuvem (Zero-Knowledge, idêntico ao Porquinho)
-- Execute este script no SQL Editor do seu projeto Supabase

create table if not exists public.media_vaults (
  sync_id text primary key,
  payload text not null,
  salt text not null,
  updated_at timestamptz not null default now()
);

alter table public.media_vaults enable row level security;

-- Políticas de RLS para acesso com chave anon (o sync_id funciona como chave de acesso)
drop policy if exists "anon_select_media_vaults" on public.media_vaults;
create policy "anon_select_media_vaults"
  on public.media_vaults for select
  to anon
  using (true);

drop policy if exists "anon_insert_media_vaults" on public.media_vaults;
create policy "anon_insert_media_vaults"
  on public.media_vaults for insert
  to anon
  with check (true);

drop policy if exists "anon_update_media_vaults" on public.media_vaults;
create policy "anon_update_media_vaults"
  on public.media_vaults for update
  to anon
  using (true)
  with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.media_vaults to anon, authenticated;
