import { Film, Tv, Gamepad2, BookOpen, Disc3, Star, Trash2, Edit2, Trophy } from 'lucide-react'
import type { MediaItem, MediaType } from '../types'
import { STATUS_LABELS, STATUS_COLORS } from '../types'
import { formatShortDate } from '../lib/utils'

interface MediaCardProps {
  item: MediaItem
  onEdit: (item: MediaItem) => void
  onDelete: (id: string) => void
}

export function MediaCard({ item, onEdit, onDelete }: MediaCardProps) {
  const icons: Record<MediaType, any> = {
    movie: Film,
    series: Tv,
    game: Gamepad2,
    book: BookOpen,
    album: Disc3,
  }
  const IconComponent = icons[item.type] || Film

  const typeLabels: Record<MediaType, string> = {
    movie: 'Filme',
    series: 'Série',
    game: 'Jogo',
    book: 'Livro',
    album: 'Álbum',
  }

  return (
    <div className="media-card">
      <div className="media-cover-container">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="media-cover-img"
            loading="lazy"
            onError={(e) => {
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="media-cover-placeholder">
            <IconComponent size={40} />
            <span style={{ fontSize: '0.75rem' }}>{typeLabels[item.type]}</span>
          </div>
        )}

        <div className="media-badge-type">
          <IconComponent size={12} />
          <span>{typeLabels[item.type]}</span>
        </div>

        {item.rating > 0 && (
          <div className="media-badge-rating">
            <Star size={12} fill="currentColor" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="media-body">
        <h3 className="media-title">{item.title}</h3>

        <div
          className="media-status-badge"
          style={{
            color: STATUS_COLORS[item.status] || 'var(--text-secondary)',
            borderColor: STATUS_COLORS[item.status] || 'var(--border)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: STATUS_COLORS[item.status] || 'currentColor',
            }}
          />
          {STATUS_LABELS[item.status] || item.status}
        </div>

        <div className="media-meta">
          {item.releaseYear && <span>{item.releaseYear}</span>}
          {item.genre && <span>• {item.genre}</span>}
          {item.artist && <span>• {item.artist}</span>}
          {item.platform && <span>• {item.platform}</span>}
          {item.trackCount !== undefined && item.trackCount > 0 && (
            <span>• {item.trackCount} faixas</span>
          )}
          {item.hoursPlayed !== undefined && item.hoursPlayed > 0 && (
            <span>• {item.hoursPlayed}h</span>
          )}
          {item.isPlatinum && (
            <span style={{ color: 'var(--cyan-400)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              • <Trophy size={11} /> 100%
            </span>
          )}
          {item.seasonsWatched !== undefined && item.seasonsWatched > 0 && (
            <span>• T{item.seasonsWatched}</span>
          )}
        </div>

        {item.notes && <p className="media-notes">{item.notes}</p>}

        <div className="media-card-footer">
          <span className="media-card-date">
            {formatShortDate(item.createdAt)}
          </span>

          <div className="media-card-actions">
            <button
              className="icon-btn"
              onClick={() => onEdit(item)}
              title="Editar"
              aria-label="Editar"
              style={{ width: '1.875rem', height: '1.875rem' }}
            >
              <Edit2 size={14} />
            </button>
            <button
              className="icon-btn"
              onClick={() => {
                if (window.confirm(`Tem certeza que deseja remover "${item.title}"?`)) {
                  onDelete(item.id)
                }
              }}
              title="Excluir"
              aria-label="Excluir"
              style={{ width: '1.875rem', height: '1.875rem', color: 'var(--red-400)' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
