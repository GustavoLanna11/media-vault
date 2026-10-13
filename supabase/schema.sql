-- Media Vault — schema inicial
-- Rode no SQL Editor do Supabase (ou via CLI: supabase db push)

-- Extensão para UUID (já vem habilitada na maioria dos projetos)
create extension if not exists "pgcrypto";

-- Tipos enumerados
create type public.game_status as enum ('playing', 'completed', 'platinum');
create type public.book_status as enum ('reading', 'finished', 'dnf');
create type public.series_status as enum ('watching', 'finished', 'paused');

-- Filmes
create table public.movies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  year smallint,
  rating smallint check (rating >= 0 and rating <= 5),
  description text,
  notes text,
  cover_url text,
  watched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Séries
create table public.series (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  seasons_watched smallint,
  status public.series_status,
  rating smallint check (rating >= 0 and rating <= 5),
  description text,
  notes text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Livros
create table public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  author text,
  status public.book_status,
  rating smallint check (rating >= 0 and rating <= 5),
  description text,
  notes text,
  cover_url text,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Jogos
create table public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  platform text,
  status public.game_status,
  rating smallint check (rating >= 0 and rating <= 5),
  description text,
  notes text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Álbuns
create table public.albums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  artist text,
  rating smallint check (rating >= 0 and rating <= 5),
  description text,
  notes text,
  cover_url text,
  listened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Faixas (opcionalmente ligadas a um álbum)
create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  album_id uuid references public.albums (id) on delete set null,
  title text not null,
  artist text,
  rating smallint check (rating >= 0 and rating <= 5),
  description text,
  notes text,
  cover_url text,
  listened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger movies_updated before update on public.movies
  for each row execute function public.set_updated_at();
create trigger series_updated before update on public.series
  for each row execute function public.set_updated_at();
create trigger books_updated before update on public.books
  for each row execute function public.set_updated_at();
create trigger games_updated before update on public.games
  for each row execute function public.set_updated_at();
create trigger albums_updated before update on public.albums
  for each row execute function public.set_updated_at();
create trigger tracks_updated before update on public.tracks
  for each row execute function public.set_updated_at();

-- RLS
alter table public.movies enable row level security;
alter table public.series enable row level security;
alter table public.books enable row level security;
alter table public.games enable row level security;
alter table public.albums enable row level security;
alter table public.tracks enable row level security;

create policy "movies_own" on public.movies for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "series_own" on public.series for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "books_own" on public.books for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "games_own" on public.games for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "albums_own" on public.albums for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tracks_own" on public.tracks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage bucket para capas (crie no dashboard: bucket "covers", público para leitura)
-- Política sugerida: upload/delete apenas pelo dono autenticado
