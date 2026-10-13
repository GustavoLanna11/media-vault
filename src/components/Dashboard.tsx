import {
  Film,
  Tv,
  Gamepad2,
  BookOpen,
  Disc3,
  Star,
  PlusCircle,
  Clock,
  Trophy,
  CheckCircle2,
} from 'lucide-react'
import type { AppState, MediaItem, MediaType } from '../types'
import { calculateVaultStats } from '../lib/utils'
import { MediaCard } from './MediaCard'

interface DashboardProps {
  state: AppState
  onNavigateTab: (tab: string, defaultMediaType?: MediaType) => void
  onUpdate: (id: string, updated: Partial<MediaItem>) => void
  onDelete: (id: string) => void
}

export function Dashboard({
  state,
  onNavigateTab,
  onUpdate,
  onDelete,
}: DashboardProps) {
  const stats = calculateVaultStats(state.items)
  const recentItems = [...state.items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Cards de Métricas */}
      <div className="stats-grid">
        <div
          className="stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('movies')}
        >
          <div className="stat-card-label">
            <Film size={14} color="var(--violet-400)" />
            <span>Filmes</span>
          </div>
          <div className="stat-card-value">{stats.moviesCount}</div>
          <div className="stat-card-sub">
            {state.items.filter((i) => i.type === 'movie' && i.status === 'concluido').length} assistidos
          </div>
        </div>

        <div
          className="stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('series')}
        >
          <div className="stat-card-label">
            <Tv size={14} color="var(--blue-400)" />
            <span>Séries</span>
          </div>
          <div className="stat-card-value">{stats.seriesCount}</div>
          <div className="stat-card-sub">
            {state.items.filter((i) => i.type === 'series' && i.status === 'em_andamento').length} em andamento
          </div>
        </div>

        <div
          className="stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('games')}
        >
          <div className="stat-card-label">
            <Gamepad2 size={14} color="var(--green-400)" />
            <span>Jogos</span>
          </div>
          <div className="stat-card-value">{stats.gamesCount}</div>
          <div className="stat-card-sub">
            {state.items.filter((i) => i.type === 'game' && (i.status === 'zerado' || i.status === 'platinado')).length} zerados {stats.totalHoursPlayed > 0 ? `• ${stats.totalHoursPlayed}h` : ''}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">
            <Star size={14} color="var(--amber-400)" fill="var(--amber-400)" />
            <span>Média Geral</span>
          </div>
          <div className="stat-card-value">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
          </div>
          <div className="stat-card-sub">
            {stats.favoritesCount} marcados favoritos
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Cadastrar Nova Experiência</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.625rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigateTab('add', 'movie')}
          >
            <Film size={16} color="var(--violet-400)" />
            + Filme
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigateTab('add', 'series')}
          >
            <Tv size={16} color="var(--blue-400)" />
            + Série
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigateTab('add', 'game')}
          >
            <Gamepad2 size={16} color="var(--green-400)" />
            + Jogo
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigateTab('add', 'book')}
          >
            <BookOpen size={16} color="var(--amber-400)" />
            + Livro
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigateTab('add', 'album')}
          >
            <Disc3 size={16} color="var(--pink-400, #f472b6)" />
            + Álbum
          </button>
        </div>
      </div>

      {/* Adicionados Recentemente */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Recentes no Cofre</h2>
          {state.items.length > 0 && (
            <button
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              onClick={() => onNavigateTab('movies')}
            >
              Ver Todos ({state.items.length})
            </button>
          )}
        </div>

        {recentItems.length === 0 ? (
          <div className="empty-state">
            <Film size={40} />
            <h3>Seu cofre está vazio</h3>
            <p>Comece registrando os filmes, séries ou jogos que você experimentou recentemente.</p>
            <button
              className="btn btn-primary"
              onClick={() => onNavigateTab('add', 'movie')}
            >
              <PlusCircle size={16} />
              Adicionar Primeiro Registro
            </button>
          </div>
        ) : (
          <div className="media-grid">
            {recentItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onEdit={() => onNavigateTab('movies')} // abre na lista
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
