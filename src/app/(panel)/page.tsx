import {
  BookOpen,
  Clapperboard,
  Disc3,
  Gamepad2,
  Music2,
  Tv,
} from "lucide-react";
import { RecentSection } from "@/components/recent-section";
import { SetupBanner } from "@/components/setup-banner";
import { isSupabaseConfigured } from "@/lib/config";
import { getDashboardSnapshot } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";

const gameStatusLabel: Record<string, string> = {
  playing: "Jogando",
  completed: "Zerado",
  platinum: "Platina",
};

export default async function HomePage() {
  const configured = isSupabaseConfigured();
  let loggedIn = false;

  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    loggedIn = Boolean(user);
  }

  const data = await getDashboardSnapshot();

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Olá — seu vault
        </h1>
        <p className="max-w-2xl text-zinc-500">
          Um painel com o que você registrou por último: filmes, séries, livros,
          jogos, álbuns e faixas. Cada menu lateral guarda o histórico completo.
        </p>
      </div>

      {!configured ? <SetupBanner variant="env" /> : null}
      {configured && !loggedIn ? <SetupBanner variant="auth" /> : null}

      <div className="grid gap-10">
        <RecentSection
          title="Últimos filmes"
          icon={Clapperboard}
          href="/filmes"
          emptyMessage="Nenhum filme ainda — comece pelo menu Filmes."
          items={data.recentMovies.map((m) => ({
            id: m.id,
            title: m.title,
            subtitle: m.year ? String(m.year) : null,
            coverUrl: m.cover_url,
            rating: m.rating,
            dateLabel: "Assistido",
            dateValue: m.watched_at,
          }))}
        />
        <RecentSection
          title="Últimas séries"
          icon={Tv}
          href="/series"
          emptyMessage="Nenhuma série registrada."
          items={data.recentSeries.map((s) => ({
            id: s.id,
            title: s.title,
            subtitle: s.status,
            coverUrl: s.cover_url,
            rating: s.rating,
          }))}
        />
        <RecentSection
          title="Últimos livros"
          icon={BookOpen}
          href="/livros"
          emptyMessage="Nenhum livro na estante digital."
          items={data.recentBooks.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.author,
            coverUrl: b.cover_url,
            rating: b.rating,
            dateLabel: "Concluído",
            dateValue: b.finished_at,
          }))}
        />
        <RecentSection
          title="Últimos jogos"
          icon={Gamepad2}
          href="/jogos"
          emptyMessage="Nenhum jogo catalogado."
          items={data.recentGames.map((g) => ({
            id: g.id,
            title: g.title,
            subtitle: g.platform,
            coverUrl: g.cover_url,
            rating: g.rating,
            badge: g.status ? gameStatusLabel[g.status] : undefined,
          }))}
        />
        <RecentSection
          title="Últimos álbuns"
          icon={Disc3}
          href="/albuns"
          emptyMessage="Nenhum álbum ouvido registrado."
          items={data.recentAlbums.map((a) => ({
            id: a.id,
            title: a.title,
            subtitle: a.artist,
            coverUrl: a.cover_url,
            rating: a.rating,
            dateLabel: "Ouvido",
            dateValue: a.listened_at,
          }))}
        />
        <RecentSection
          title="Últimas músicas"
          icon={Music2}
          href="/musicas"
          emptyMessage="Nenhuma faixa recente."
          items={data.recentTracks.map((t) => ({
            id: t.id,
            title: t.title,
            subtitle: t.artist,
            coverUrl: t.cover_url,
            rating: t.rating,
            dateLabel: "Ouvida",
            dateValue: t.listened_at,
          }))}
        />
      </div>
    </div>
  );
}
