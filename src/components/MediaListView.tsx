import { useState, useMemo } from 'react'
import { Search, Plus, Film, Tv, Gamepad2, BookOpen, X } from 'lucide-react'
import type { MediaItem, MediaType, WatchStatus } from '../types'
import {
  STATUS_LABELS,
  GAME_STATUS_OPTIONS,
  DEFAULT_STATUS_OPTIONS,
  GENRES_BY_TYPE,
} from '../types'
import { MediaCard } from './MediaCard'
import { MediaForm } from './MediaForm'

interface MediaListViewProps {
  type?: MediaType // se for fixo (filmes, séries, jogos) ou undefined (todos)
  items: MediaItem[]
  onUpdate: (id: string, updated: Partial<MediaItem>) => void
  onDelete: (id: string) => void
  onAddNew?: () => void
}

export function MediaListView({
  type,
  items,
  onUpdate,
  onDelete,
  onAddNew,
}: MediaListViewProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [genreFilter, setGenreFilter] = useState<string>('all')
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (type && item.type !== type) return false
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (genreFilter !== 'all' && item.genre !== genreFilter) return false
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchesTitle = item.title.toLowerCase().includes(query)
        const matchesNotes = item.notes?.toLowerCase().includes(query)
        const matchesGenre = item.genre?.toLowerCase().includes(query)
        const matchesPlatform = item.platform?.toLowerCase().includes(query)
        const matchesDirector = item.director?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesNotes && !matchesGenre && !matchesPlatform && !matchesDirector) {
          return false
        }
      }
      return true
    })
  }, [items, type, statusFilter, genreFilter, search])

  const genres = useMemo(() => {
    if (type) return GENRES_BY_TYPE[type] || []
    return Array.from(new Set(Object.values(GENRES_BY_TYPE).flat()))
  }, [type])

  const typeTitles: Record<MediaType, string> = {
    movie: 'filme',
    series: 'série',
    game: 'jogo',
    book: 'livro',
  }

  return (
    <div>
      {/* Modal de Edição */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '640px', textAlign: 'left' }}>
            <button
              className="modal-close"
              onClick={() => setEditingItem(null)}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
            <h2 className="modal-title" style={{ marginBottom: '1.25rem' }}>
              Editar {editingItem.title}
            </h2>
            <MediaForm
              initialData={editingItem}
              onSubmit={(updated) => {
                onUpdate(editingItem.id, updated)
                setEditingItem(null)
              }}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={`Buscar ${type ? typeTitles[type] + 's' : 'títulos'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="icon-btn"
              onClick={() => setSearch('')}
              style={{ width: '1.5rem', height: '1.5rem' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {genres.length > 0 && (
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="all">Todos os Gêneros</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Status Chips */}
      <div className="filter-chips" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`filter-chip ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          Todos ({type ? items.filter((i) => i.type === type).length : items.length})
        </button>
        {(type === 'game' ? GAME_STATUS_OPTIONS : DEFAULT_STATUS_OPTIONS).map(
          (opt) => {
            const count = items.filter(
              (i) => (!type || i.type === type) && i.status === opt.id
            ).length
            return (
              <button
                key={opt.id}
                className={`filter-chip ${statusFilter === opt.id ? 'active' : ''}`}
                onClick={() => setStatusFilter(opt.id)}
              >
                {opt.label} ({count})
              </button>
            )
          }
        )}
      </div>

      {/* Lista / Grid de Mídias */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          {type === 'movie' ? (
            <Film size={44} />
          ) : type === 'series' ? (
            <Tv size={44} />
          ) : type === 'game' ? (
            <Gamepad2 size={44} />
          ) : (
            <BookOpen size={44} />
          )}
          <h3>Nenhum registro encontrado</h3>
          <p>
            {search || statusFilter !== 'all' || genreFilter !== 'all'
              ? 'Tente ajustar os filtros ou a busca acima.'
              : `Seu cofre ainda não tem ${type ? typeTitles[type] + 's' : 'itens'} cadastrados.`}
          </p>
          {onAddNew && (
            <button className="btn btn-primary" onClick={onAddNew}>
              <Plus size={16} />
              Adicionar Agora
            </button>
          )}
        </div>
      ) : (
        <div className="media-grid">
          {filteredItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onEdit={(it) => setEditingItem(it)}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
