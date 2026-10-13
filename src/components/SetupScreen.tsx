import { useState, useEffect } from 'react'
import { Lock, ShieldCheck, Film } from 'lucide-react'

interface SetupScreenProps {
  onSetup: (pin: string) => Promise<void>
  onRestore: (syncId: string, pin: string) => Promise<boolean>
  cloudEnabled: boolean
  isLoading: boolean
  error: string | null
  initialUrlSyncId?: string | null
}

export function SetupScreen({
  onSetup,
  onRestore,
  cloudEnabled: _cloudEnabled,
  isLoading,
  error,
  initialUrlSyncId,
}: SetupScreenProps) {
  const [mode, setMode] = useState<'new' | 'restore'>(initialUrlSyncId ? 'restore' : 'new')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [syncId, setSyncId] = useState(initialUrlSyncId || '')

  useEffect(() => {
    if (initialUrlSyncId) {
      setSyncId(initialUrlSyncId)
      setMode('restore')
    }
  }, [initialUrlSyncId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'restore') {
      if (pin.length < 4 || !syncId.trim()) return
      await onRestore(syncId.trim(), pin)
      return
    }

    if (pin.length < 4) return
    if (pin !== confirmPin) return
    await onSetup(pin)
  }

  const pinMismatch = confirmPin.length > 0 && pin !== confirmPin

  return (
    <div className="auth-shell">
      <div className="auth-screen">
        <div className="auth-logo">
          <Film size={32} />
        </div>
        <h1 className="auth-title">Media Vault</h1>

        <div className="auth-mode-toggle">
          <button
            type="button"
            className={`auth-mode-btn ${mode === 'new' ? 'active' : ''}`}
            onClick={() => {
              setMode('new')
              setPin('')
              setConfirmPin('')
            }}
          >
            Novo Cofre
          </button>
          <button
            type="button"
            className={`auth-mode-btn ${mode === 'restore' ? 'active' : ''}`}
            onClick={() => {
              setMode('restore')
              setPin('')
            }}
          >
            Restaurar Acesso
          </button>
        </div>

        <p className="auth-subtitle">
          {mode === 'restore'
            ? 'Informe seu código numérico de 8 dígitos e seu PIN para acessar este cofre.'
            : 'Defina um PIN pessoal. Seus filmes, séries e jogos serão criptografados (PBKDF2 + AES-256) e você terá um link/código numérico exclusivo.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'restore' ? (
            <>
              <div className="form-group">
                <label className="form-label">Código Único do Cofre (8 dígitos)</label>
                <input
                  type="text"
                  value={syncId}
                  onChange={(e) => setSyncId(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="Ex: 84920153"
                  maxLength={8}
                  inputMode="numeric"
                  autoFocus={!initialUrlSyncId}
                  spellCheck={false}
                />
              </div>

              <div className="form-group">
                <label className="form-label">PIN do Cofre</label>
                <input
                  type="password"
                  className="pin-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="••••"
                  maxLength={8}
                  inputMode="numeric"
                  autoFocus={!!initialUrlSyncId}
                />
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button
                type="submit"
                className="btn btn-primary btn-full mt-2"
                disabled={pin.length < 4 || syncId.length < 4 || isLoading}
              >
                {isLoading ? 'Descriptografando...' : 'Acessar Meu Cofre'}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Criar PIN de Acesso (mín. 4 dígitos)</label>
                <input
                  type="password"
                  className="pin-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="••••"
                  maxLength={8}
                  inputMode="numeric"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar PIN</label>
                <input
                  type="password"
                  className="pin-input"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="••••"
                  maxLength={8}
                  inputMode="numeric"
                />
                {pinMismatch && <p className="error-msg">PINs não coincidem</p>}
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button
                type="submit"
                className="btn btn-primary btn-full mt-2"
                disabled={pin.length < 4 || pin !== confirmPin || isLoading}
              >
                {isLoading ? 'Criando cofre seguro...' : 'Criar Cofre e Começar'}
              </button>
            </>
          )}
        </form>

        <div className="security-badge">
          <ShieldCheck size={16} />
          <span>Zero-Knowledge: Chaves geradas no dispositivo</span>
        </div>
      </div>
    </div>
  )
}
