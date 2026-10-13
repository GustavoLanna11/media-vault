export type MediaKind =
  | "movie"
  | "series"
  | "book"
  | "game"
  | "album"
  | "track";

export type GameStatus = "playing" | "completed" | "platinum";

export type BookStatus = "reading" | "finished" | "dnf";

export interface BaseEntry {
  id: string;
  user_id: string;
  title: string;
  rating: number | null;
  description: string | null;
  notes: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Movie extends BaseEntry {
  year: number | null;
  watched_at: string | null;
}

export interface Series extends BaseEntry {
  seasons_watched: number | null;
  status: "watching" | "finished" | "paused" | null;
}

export interface Book extends BaseEntry {
  author: string | null;
  status: BookStatus | null;
  finished_at: string | null;
}

export interface Game extends BaseEntry {
  platform: string | null;
  status: GameStatus | null;
}

export interface Album extends BaseEntry {
  artist: string | null;
  listened_at: string | null;
}

export interface Track extends BaseEntry {
  artist: string | null;
  album_id: string | null;
  listened_at: string | null;
}

export interface DashboardSnapshot {
  recentMovies: Movie[];
  recentSeries: Series[];
  recentBooks: Book[];
  recentGames: Game[];
  recentAlbums: Album[];
  recentTracks: Track[];
}
