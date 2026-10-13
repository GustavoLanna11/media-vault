import { useState } from 'react'
import {
  LayoutDashboard,
  Film,
  Tv,
  Gamepad2,
  Disc3,
  PlusCircle,
  Settings as SettingsIcon,
  Lock,
  Plus,
} from 'lucide-react'
import { useVault } from './hooks/useVault'
import type { MediaType } from './types'

import { SetupScreen } from './components/SetupScreen'
import { LockScreen } from './components/LockScreen'
import { SyncCodeModal } from './components/SyncCodeModal'
import { Dashboard } from './components/Dashboard'
import { MediaListView } from './components/MediaListView'
import { MediaForm } from './components/MediaForm'
import { Settings } from './components/Settings'
import './App.css'

type Tab = 'home' | 'movies' | 'series' | 'games' | 'albums' | 'add' | 'settings'

export function App() {
  const vault = useVault()
  const [tab, setTab] = useState<Tab>('home')
  const [defaultMediaType, setDefaultMediaType] = useState<MediaType>('movie')

  if (vault.isLoading && !vault.state) {
    return (
      <div className="auth-shell">
        <div className="auth-screen">
          <p style={{ color: 'var(--text-muted)' }}>Carregando cofre...</p>
        </div>
      </div>
    )
  }

  if (vault.needsSetup) {
    return (
      <SetupScreen
        onSetup={vault.setup}
        onRestore={vault.restoreFromCloud}
        cloudEnabled={vault.cloudEnabled}
        isLoading={vault.isLoading}
        error={vault.error}
        initialUrlSyncId={vault.initialUrlSyncId}
      />
    )
  }

  if (vault.isLocked || !vault.state) {
    return (
      <LockScreen
        onUnlock={vault.unlock}
        isLoading={vault.isLoading}
        error={vault.error}
        syncId={vault.syncId}
        onResetToSetup={() => {
          localStorage.removeItem('media_vault_encrypted')
          localStorage.removeItem('media_vault_salt')
          window.location.reload()
        }}
      />
    )
  }

  const titles: Record<Tab, string> = {
    home: 'Painel Geral',
    movies: 'Filmes',
    series: 'Séries',
    games: 'Jogos',
    albums: 'Álbuns',
    add: 'Adicionar Experiência',
    settings: 'Ajustes & Acesso',
  }

  const navItems = [
    { id: 'home' as Tab, icon: LayoutDashboard, label: 'Início' },
    { id: 'movies' as Tab, icon: Film, label: 'Filmes' },
    { id: 'series' as Tab, icon: Tv, label: 'Séries' },
    { id: 'games' as Tab, icon: Gamepad2, label: 'Jogos' },
    { id: 'albums' as Tab, icon: Disc3, label: 'Álbuns' },
    { id: 'add' as Tab, icon: PlusCircle, label: 'Adicionar' },
    { id: 'settings' as Tab, icon: SettingsIcon, label: 'Ajustes' },
  ]

  const totalCount = vault.state.items.length

  const handleNavigateTab = (newTab: string, mediaType?: MediaType) => {
    if (mediaType) {
      setDefaultMediaType(mediaType)
    }
    setTab(newTab as Tab)
  }

  const listTabs: Tab[] = ['movies', 'series', 'games', 'albums']
  const addForCurrentListTab = () => {
    if (tab === 'movies') handleNavigateTab('add', 'movie')
    else if (tab === 'series') handleNavigateTab('add', 'series')
    else if (tab === 'games') handleNavigateTab('add', 'game')
    else if (tab === 'albums') handleNavigateTab('add', 'album')
  }

  return (
    <div className="app-shell">
      <div className="app">
        {vault.pendingSyncCode && (
          <SyncCodeModal
            syncCode={vault.pendingSyncCode}
            onClose={vault.clearPendingSyncCode}
          />
        )}

        {/* Sidebar no Desktop */}
        <nav className="sidebar-nav" aria-label="Navegação principal">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <Film size={22} />
            </div>
            <div>
              <p className="sidebar-brand-name">Media Vault</p>
              <p className="sidebar-brand-tagline">Central de entretenimento</p>
            </div>
          </div>

          <div className="sidebar-links">
            {navItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className={`sidebar-link ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id)}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-balance">
              <span className="sidebar-balance-label">Total Cadastrado</span>
              <span className="sidebar-balance-value">
                {totalCount} {totalCount === 1 ? 'registro' : 'registros'}
              </span>
            </div>

            <button className="sidebar-lock" onClick={vault.lock} aria-label="Bloquear">
              <Lock size={16} />
              Bloquear Cofre
            </button>
          </div>
        </nav>

        {/* Corpo Principal */}
        <div className="app-body">
          <header className="app-header">
            <h1>{titles[tab]}</h1>
            <div className="app-header-actions">
              {listTabs.includes(tab) && (
                <button
                  type="button"
                  className="btn btn-primary btn-header-add"
                  onClick={addForCurrentListTab}
                >
                  <Plus size={16} />
                  Adicionar
                </button>
              )}
              <button className="icon-btn" onClick={vault.lock} aria-label="Bloquear">
                <Lock size={18} />
              </button>
            </div>
          </header>

          <main className="app-main">
            {tab === 'home' && (
              <Dashboard
                state={vault.state}
                onNavigateTab={handleNavigateTab}
                onUpdate={vault.updateItem}
                onDelete={vault.deleteItem}
              />
            )}

            {tab === 'movies' && (
              <MediaListView
                type="movie"
                items={vault.state.items}
                onUpdate={vault.updateItem}
                onDelete={vault.deleteItem}
                onAddNew={() => handleNavigateTab('add', 'movie')}
              />
            )}

            {tab === 'series' && (
              <MediaListView
                type="series"
                items={vault.state.items}
                onUpdate={vault.updateItem}
                onDelete={vault.deleteItem}
                onAddNew={() => handleNavigateTab('add', 'series')}
              />
            )}

            {tab === 'games' && (
              <MediaListView
                type="game"
                items={vault.state.items}
                onUpdate={vault.updateItem}
                onDelete={vault.deleteItem}
                onAddNew={() => handleNavigateTab('add', 'game')}
              />
            )}

            {tab === 'albums' && (
              <MediaListView
                type="album"
                items={vault.state.items}
                onUpdate={vault.updateItem}
                onDelete={vault.deleteItem}
                onAddNew={() => handleNavigateTab('add', 'album')}
              />
            )}

            {tab === 'add' && (
              <MediaForm
                defaultType={defaultMediaType}
                onSubmit={(item) => {
                  vault.addItem(item)
                  if (item.type === 'movie') setTab('movies')
                  else if (item.type === 'series') setTab('series')
                  else if (item.type === 'game') setTab('games')
                  else if (item.type === 'album') setTab('albums')
                  else setTab('home')
                }}
              />
            )}

            {tab === 'settings' && (
              <Settings
                state={vault.state}
                cloudEnabled={vault.cloudEnabled}
                syncId={vault.syncId}
                syncStatus={vault.syncStatus}
                onChangePin={vault.changePin}
                onExport={vault.exportBackup}
                onImport={vault.importBackup}
                onLock={vault.lock}
                error={vault.error}
              />
            )}
          </main>
        </div>

        {/* Barra de Navegação Inferior (Mobile) */}
        <nav className="bottom-nav" aria-label="Navegação mobile">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`nav-item ${tab === id ? 'active' : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default App
