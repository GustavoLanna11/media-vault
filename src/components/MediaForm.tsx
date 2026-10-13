import { useState } from 'react'
import {
  Film,
  Tv,
  Gamepad2,
  BookOpen,
  Disc3,
  Star,
  Check,
  Image as ImageIcon,
  Clock,
  Trophy,
} from 'lucide-react'
import type { MediaItem, MediaType, WatchStatus } from '../types'
import {
  MEDIA_TYPES,
  STATUS_LABELS,
  GAME_STATUS_OPTIONS,
  DEFAULT_STATUS_OPTIONS,
  GENRES_BY_TYPE,
  PLATFORMS,
} from '../types'

interface MediaFormProps {
  initialData?: MediaItem
  onSubmit: (item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel?: () => void
  defaultType?: MediaType
}

export function MediaForm({
  initialData,
  onSubmit,
  onCancel,
  defaultType = 'movie',
}: MediaFormProps) {
  const [type, setType] = useState<MediaType>(initialData?.type || defaultType)
  const [title, setTitle] = useState(initialData?.title || '')
  const [originalTitle, setOriginalTitle] = useState(initialData?.originalTitle || '')
  const [status, setStatus] = useState<WatchStatus>(
    (initialData?.status as WatchStatus) || (defaultType === 'game' ? 'em_andamento' : 'concluido')
  )
  const [rating, setRating] = useState<number>(initialData?.rating ?? 8)
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || '')
  const [releaseYear, setReleaseYear] = useState(initialData?.releaseYear ? String(initialData.releaseYear) : '')
  const [genre, setGenre] = useState(initialData?.genre || '')
  const [notes, setNotes] = useState(initialData?.notes || '')

  // Específicos
  const [director, setDirector] = useState(initialData?.director || '')
  const [durationMinutes, setDurationMinutes] = useState(
    initialData?.durationMinutes ? String(initialData.durationMinutes) : ''
  )
  const [seasonsWatched, setSeasonsWatched] = useState(
    initialData?.seasonsWatched !== undefined ? String(initialData.seasonsWatched) : '1'
  )
  const [totalSeasons, setTotalSeasons] = useState(
    initialData?.totalSeasons !== undefined ? String(initialData.totalSeasons) : ''
  )
  const [currentEpisode, setCurrentEpisode] = useState(
    initialData?.currentEpisode !== undefined ? String(initialData.currentEpisode) : ''
  )
  const [platform, setPlatform] = useState(initialData?.platform || 'PC')
  const [hoursPlayed, setHoursPlayed] = useState(
    initialData?.hoursPlayed !== undefined ? String(initialData.hoursPlayed) : ''
  )
  const [isPlatinum, setIsPlatinum] = useState(initialData?.isPlatinum || false)
  const [author, setAuthor] = useState(initialData?.author || '')
  const [pagesRead, setPagesRead] = useState(
    initialData?.pagesRead !== undefined ? String(initialData.pagesRead) : ''
  )
  const [totalPages, setTotalPages] = useState(
    initialData?.totalPages !== undefined ? String(initialData.totalPages) : ''
  )
  const [artist, setArtist] = useState(initialData?.artist || '')
  const [trackCount, setTrackCount] = useState(
    initialData?.trackCount !== undefined ? String(initialData.trackCount) : ''
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      type,
      title: title.trim(),
      originalTitle: originalTitle.trim() || undefined,
      status,
      rating: Number(rating),
      coverUrl: coverUrl.trim() || undefined,
      releaseYear: releaseYear ? parseInt(releaseYear, 10) : undefined,
      genre: genre.trim() || undefined,
      notes: notes.trim() || undefined,
      director: type === 'movie' && director.trim() ? director.trim() : undefined,
      durationMinutes: type === 'movie' && durationMinutes ? parseInt(durationMinutes, 10) : undefined,
      seasonsWatched: type === 'series' && seasonsWatched ? parseInt(seasonsWatched, 10) : undefined,
      totalSeasons: type === 'series' && totalSeasons ? parseInt(totalSeasons, 10) : undefined,
      currentEpisode: type === 'series' && currentEpisode ? parseInt(currentEpisode, 10) : undefined,
      platform: type === 'game' && platform.trim() ? platform.trim() : undefined,
      hoursPlayed: type === 'game' && hoursPlayed ? parseFloat(hoursPlayed) : undefined,
      isPlatinum: type === 'game' ? isPlatinum : undefined,
      author: type === 'book' && author.trim() ? author.trim() : undefined,
      pagesRead: type === 'book' && pagesRead ? parseInt(pagesRead, 10) : undefined,
      totalPages: type === 'book' && totalPages ? parseInt(totalPages, 10) : undefined,
      artist: type === 'album' && artist.trim() ? artist.trim() : undefined,
      trackCount: type === 'album' && trackCount ? parseInt(trackCount, 10) : undefined,
    })
  }

  const icons: Record<MediaType, any> = {
    movie: Film,
    series: Tv,
    game: Gamepad2,
    book: BookOpen,
    album: Disc3,
  }

  return (
    <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        {!initialData && (
          <div className="form-group">
            <label className="form-label">Tipo de Mídia</label>
            <div className="type-selector">
              {MEDIA_TYPES.map(({ id, label }) => {
                const IconComponent = icons[id]
                return (
                  <button
                    key={id}
                    type="button"
                    className={`type-btn ${type === id ? 'active' : ''}`}
                    onClick={() => {
                      setType(id)
                      setGenre('')
                      if (id === 'game') {
                        setStatus('em_andamento')
                      } else {
                        setStatus('concluido')
                      }
                    }}
                  >
                    <IconComponent size={20} />
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Título *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Nome do ${type === 'movie' ? 'filme' : type === 'series' ? 'seriado' : type === 'game' ? 'jogo' : type === 'album' ? 'álbum' : 'livro'}`}
            autoFocus
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={status}
              onChange={(e) => {
                const newStatus = e.target.value as WatchStatus
                setStatus(newStatus)
                if (newStatus === 'platinado') {
                  setIsPlatinum(true)
                }
              }}
            >
              {(type === 'game' ? GAME_STATUS_OPTIONS : DEFAULT_STATUS_OPTIONS).map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Avaliação (0 a 10): <strong>{rating.toFixed(1)}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              style={{ padding: '0.4rem 0', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Gênero</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">Selecione ou deixe em branco</option>
              {GENRES_BY_TYPE[type]?.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Ano de Lançamento</label>
            <input
              type="number"
              placeholder="Ex: 2024"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              min="1900"
              max="2099"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">URL da Imagem / Capa (Pôster)</label>
          <input
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://exemplo.com/poster.jpg"
          />
          {coverUrl && (
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '64px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                }}
              >
                <img
                  src={coverUrl}
                  alt="Prévia"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Prévia da capa
              </span>
            </div>
          )}
        </div>

        {/* Campos dinâmicos por tipo */}
        {type === 'movie' && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Diretor(a)</label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Ex: Christopher Nolan"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duração (minutos)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="Ex: 148"
              />
            </div>
          </div>
        )}

        {type === 'series' && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Temporadas Assistidas</label>
              <input
                type="number"
                value={seasonsWatched}
                onChange={(e) => setSeasonsWatched(e.target.value)}
                placeholder="Ex: 3"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Episódio Atual</label>
              <input
                type="number"
                value={currentEpisode}
                onChange={(e) => setCurrentEpisode(e.target.value)}
                placeholder="Ex: 8"
              />
            </div>
          </div>
        )}

        {type === 'game' && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Plataforma</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Horas Jogadas</label>
              <input
                type="number"
                step="0.5"
                value={hoursPlayed}
                onChange={(e) => setHoursPlayed(e.target.value)}
                placeholder="Ex: 45.5"
              />
            </div>
          </div>
        )}

        {type === 'game' && (
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <input
              type="checkbox"
              id="platinum-check"
              checked={isPlatinum}
              onChange={(e) => setIsPlatinum(e.target.checked)}
              style={{ width: 'auto', margin: 0 }}
            />
            <label
              htmlFor="platinum-check"
              style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Trophy size={14} style={{ color: 'var(--cyan-400)' }} />
              Platinado / 100% Concluído
            </label>
          </div>
        )}

        {type === 'book' && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Autor(a)</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: George R. R. Martin"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Páginas Lidas</label>
              <input
                type="number"
                value={pagesRead}
                onChange={(e) => setPagesRead(e.target.value)}
                placeholder="Ex: 320"
              />
            </div>
          </div>
        )}

        {type === 'album' && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Artista / Banda</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Ex: Radiohead"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nº de Faixas</label>
              <input
                type="number"
                value={trackCount}
                onChange={(e) => setTrackCount(e.target.value)}
                placeholder="Ex: 12"
                min="1"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Comentários & Crítica Pessoal</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="O que achou? O que chamou atenção na experiência?"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-full">
            <Check size={18} />
            {initialData ? 'Salvar Alterações' : 'Adicionar ao Cofre'}
          </button>
        </div>
      </form>
    </div>
  )
}
