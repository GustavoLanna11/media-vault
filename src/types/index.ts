export type MediaType = 'movie' | 'series' | 'game' | 'book'

export type WatchStatus =
  | 'zerado'
  | 'em_andamento'
  | 'dropado'
  | 'platinado'
  | 'concluido'
  | 'planejado'
  | 'favorito'
  | 'abandonado'

export interface MediaItem {
  id: string
  type: MediaType
  title: string
  originalTitle?: string
  status: WatchStatus | string
  rating: number // 0 a 10
  coverUrl?: string
  releaseYear?: number
  genre?: string
  notes?: string
  createdAt: string
  updatedAt: string
  // Filmes
  director?: string
  durationMinutes?: number
  // Séries
  seasonsWatched?: number
  totalSeasons?: number
  currentEpisode?: number
  // Jogos
  platform?: string
  hoursPlayed?: number
  isPlatinum?: boolean
  // Livros
  author?: string
  pagesRead?: number
  totalPages?: number
}

export interface AppState {
  items: MediaItem[]
  pinHash?: string
  salt?: string
  isSetup: boolean
}

export const MEDIA_TYPES: { id: MediaType; label: string; icon: string }[] = [
  { id: 'movie', label: 'Filmes', icon: 'Film' },
  { id: 'series', label: 'Séries', icon: 'Tv' },
  { id: 'game', label: 'Jogos', icon: 'Gamepad2' },
  { id: 'book', label: 'Livros', icon: 'BookOpen' },
]

export const GAME_STATUS_OPTIONS = [
  { id: 'em_andamento', label: 'Em Andamento' },
  { id: 'zerado', label: 'Zerado' },
  { id: 'platinado', label: 'Platinado' },
  { id: 'dropado', label: 'Dropado' },
] as const

export const DEFAULT_STATUS_OPTIONS = [
  { id: 'planejado', label: 'Na Fila / Quero Ver' },
  { id: 'em_andamento', label: 'Em Andamento' },
  { id: 'concluido', label: 'Concluído' },
  { id: 'favorito', label: 'Favorito' },
  { id: 'dropado', label: 'Dropado' },
] as const

export const STATUS_LABELS: Record<string, string> = {
  zerado: 'Zerado',
  platinado: 'Platinado',
  em_andamento: 'Em Andamento',
  dropado: 'Dropado',
  concluido: 'Concluído',
  planejado: 'Na Fila / Quero Ver',
  favorito: 'Favorito',
  abandonado: 'Dropado',
}

export const STATUS_COLORS: Record<string, string> = {
  zerado: 'var(--green-400, #4ade80)',
  platinado: 'var(--cyan-400, #38bdf8)',
  em_andamento: 'var(--amber-400, #fbbf24)',
  dropado: 'var(--red-400, #f87171)',
  concluido: 'var(--green-400, #4ade80)',
  planejado: 'var(--blue-400, #60a5fa)',
  favorito: 'var(--purple-400, #c084fc)',
  abandonado: 'var(--red-400, #f87171)',
}

export const GENRES_BY_TYPE: Record<MediaType, string[]> = {
  movie: ['Ação', 'Comédia', 'Drama', 'Ficção Científica', 'Terror', 'Suspense', 'Animação', 'Aventura', 'Romance', 'Documentário', 'Fantasia'],
  series: ['Drama', 'Comédia', 'Ficção Científica', 'Crime / Policial', 'Anime', 'Mistério', 'Fantasia', 'Ação', 'Documentário'],
  game: ['RPG', 'Ação / Aventura', 'FPS / Shooter', 'Mundo Aberto', 'Souls-like', 'Estratégia', 'Plataforma', 'Corrida', 'Esportes', 'Indie', 'Terror / Sobrevivência'],
  book: ['Ficção', 'Fantasia', 'Ficção Científica', 'Desenvolvimento Pessoal', 'Biografia', 'História', 'Tecnologia / Negócios', 'Filosofia'],
}

export const PLATFORMS = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'PlayStation 3',
  'PlayStation 2 (PS2)',
  'Xbox Series X/S',
  'Xbox One',
  'Xbox 360',
  'Nintendo Switch',
  'Retro',
  'Mobile',
]

export const INITIAL_STATE: AppState = {
  items: [],
  isSetup: false,
}
