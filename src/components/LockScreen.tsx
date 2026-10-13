import { useState } from 'react'
import { Lock, Film } from 'lucide-react'

interface LockScreenProps {
  onUnlock: (pin: string) => Promise<boolean>
  isLoading: boolean
  error: string | null
  syncId: string | null
  onResetToSetup?: () => void
}

export function LockScreen({
  onUnlock,
  isLoading,
  error,
  syncId,
  onResetToSetup,
}: LockScreenProps) {
  const [pin, setPin] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length < 4) return
    const success = await onUnlock(pin)
    if (!success) setPin('')
  }

  return (
    <div className="auth-shell">
      <div className="auth-screen">
        <div className="auth-logo">
          <Film size={32} />
        </div>
        <h1 className="auth-title">Media Vault</h1>
        <p className="auth-subtitle">
          Digite seu PIN para desbloquear seu catálogo de entretenimento.
        </p>

        {syncId && (
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-card)',
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                fontFamily: 'monospace',
              }}
            >
              Cofre #{syncId}
            </span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
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

          <button
            type="submit"
            className="btn btn-primary btn-full mt-2"
            disabled={pin.length < 4 || isLoading}
          >
            {isLoading ? 'Desbloqueando...' : 'Desbloquear Cofre'}
          </button>

          {error && <p className="error-msg">{error}</p>}
        </form>

        {onResetToSetup && (
          <button
            type="button"
            className="auth-link-btn"
            style={{
              marginTop: '1.25rem',
              background: 'none',
              border: 'none',
              color: 'var(--violet-400)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={onResetToSetup}
          >
            Entrar com outro cofre ou restaurar
          </button>
        )}

        <div className="security-badge">
          <Lock size={14} />
          <span>Seus dados são protegidos com AES-256 no seu navegador.</span>
        </div>
      </div>
    </div>
  )
}
