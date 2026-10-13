import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { DashboardSnapshot } from "@/lib/types";

const empty: DashboardSnapshot = {
  recentMovies: [],
  recentSeries: [],
  recentBooks: [],
  recentGames: [],
  recentAlbums: [],
  recentTracks: [],
};

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!isSupabaseConfigured()) return empty;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return empty;

  const limit = 6;

  const [movies, series, books, games, albums, tracks] = await Promise.all([
    supabase
      .from("movies")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("series")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("albums")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("tracks")
      .select("*")
      .order("listened_at", { ascending: false, nullsFirst: false })
      .limit(limit),
  ]);

  return {
    recentMovies: movies.data ?? [],
    recentSeries: series.data ?? [],
    recentBooks: books.data ?? [],
    recentGames: games.data ?? [],
    recentAlbums: albums.data ?? [],
    recentTracks: tracks.data ?? [],
  };
}
