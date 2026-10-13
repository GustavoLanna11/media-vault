import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { MediaItem, MediaType, WatchStatus, AppState } from '../types'

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "dd 'de' MMM, yyyy", { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return dateStr
  }
}

export interface VaultStats {
  totalItems: number
  moviesCount: number
  seriesCount: number
  gamesCount: number
  booksCount: number
  completedCount: number
  inProgressCount: number
  favoritesCount: number
  averageRating: number
  totalHoursPlayed: number
}

export function calculateVaultStats(items: MediaItem[] = []): VaultStats {
  const totalItems = items.length
  let moviesCount = 0
  let seriesCount = 0
  let gamesCount = 0
  let booksCount = 0
  let completedCount = 0
  let inProgressCount = 0
  let favoritesCount = 0
  let ratingSum = 0
  let ratedItemsCount = 0
  let totalHoursPlayed = 0

  for (const item of items) {
    if (item.type === 'movie') moviesCount++
    if (item.type === 'series') seriesCount++
    if (item.type === 'game') {
      gamesCount++
      if (item.hoursPlayed) totalHoursPlayed += Number(item.hoursPlayed)
    }
    if (item.type === 'book') booksCount++

    if (item.status === 'concluido' || item.status === 'zerado' || item.status === 'platinado') completedCount++
    if (item.status === 'em_andamento') inProgressCount++
    if (item.status === 'favorito' || item.isPlatinum || item.status === 'platinado') favoritesCount++

    if (item.rating && item.rating > 0) {
      ratingSum += Number(item.rating)
      ratedItemsCount++
    }
  }

  const averageRating = ratedItemsCount > 0 ? Number((ratingSum / ratedItemsCount).toFixed(1)) : 0

  return {
    totalItems,
    moviesCount,
    seriesCount,
    gamesCount,
    booksCount,
    completedCount,
    inProgressCount,
    favoritesCount,
    averageRating,
    totalHoursPlayed,
  }
}

export function normalizeAppState(raw: any): AppState {
  if (!raw || typeof raw !== 'object') {
    return { items: [], isSetup: false }
  }

  // Se já possui items
  if (Array.isArray(raw.items)) {
    return {
      items: raw.items,
      pinHash: raw.pinHash,
      salt: raw.salt,
      isSetup: raw.isSetup ?? true,
    }
  }

  // Retrocompatibilidade se era o formato antigo { movies: [], series: [], games: [], books: [] }
  const items: MediaItem[] = []
  if (Array.isArray(raw.movies)) {
    for (const m of raw.movies) {
      items.push({
        id: m.id || generateId(),
        type: 'movie',
        title: m.title || 'Sem título',
        status: m.watched_at ? 'concluido' : 'planejado',
        rating: m.rating || 0,
        coverUrl: m.cover_url || undefined,
        releaseYear: m.year || undefined,
        notes: m.notes || m.description || undefined,
        createdAt: m.createdAt || new Date().toISOString(),
        updatedAt: m.updatedAt || new Date().toISOString(),
      })
    }
  }
  if (Array.isArray(raw.series)) {
    for (const s of raw.series) {
      items.push({
        id: s.id || generateId(),
        type: 'series',
        title: s.title || 'Sem título',
        status: s.status === 'finished' ? 'concluido' : s.status === 'watching' ? 'em_andamento' : 'planejado',
        rating: s.rating || 0,
        coverUrl: s.cover_url || undefined,
        seasonsWatched: s.seasons_watched || 0,
        notes: s.notes || s.description || undefined,
        createdAt: s.createdAt || new Date().toISOString(),
        updatedAt: s.updatedAt || new Date().toISOString(),
      })
    }
  }
  if (Array.isArray(raw.games)) {
    for (const g of raw.games) {
      items.push({
        id: g.id || generateId(),
        type: 'game',
        title: g.title || 'Sem título',
        status: g.status === 'completed' || g.status === 'platinum' ? 'concluido' : g.status === 'playing' ? 'em_andamento' : 'planejado',
        isPlatinum: g.status === 'platinum',
        platform: g.platform || undefined,
        rating: g.rating || 0,
        coverUrl: g.cover_url || undefined,
        notes: g.notes || g.description || undefined,
        createdAt: g.createdAt || new Date().toISOString(),
        updatedAt: g.updatedAt || new Date().toISOString(),
      })
    }
  }

  return {
    items,
    pinHash: raw.pinHash,
    salt: raw.salt,
    isSetup: raw.isSetup ?? (items.length > 0),
  }
}
