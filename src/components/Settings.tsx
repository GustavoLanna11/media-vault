import { useState, useRef } from 'react'
import {
  Lock,
  Download,
  Upload,
  Cloud,
  Copy,
  Check,
  Link,
  KeyRound,
  ShieldCheck,
  Server,
} from 'lucide-react'
import type { AppState } from '../types'
import type { SyncStatus } from '../lib/sync'

interface SettingsProps {
  state: AppState
  cloudEnabled: boolean
  syncId: string | null
  syncStatus: SyncStatus
  onChangePin: (oldPin: string, newPin: string) => Promise<boolean>
  onExport: () => void
  onImport: (json: string, pin: string) => Promise<boolean>
  onLock: () => void
  error: string | null
}

export function Settings({
  state,
  cloudEnabled,
  syncId,
  syncStatus,
  onChangePin,
  onExport,
  onImport,
  onLock,
  error,
}: SettingsProps) {
  const [showPinChange, setShowPinChange] = useState(false)
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmNewPin, setConfirmNewPin] = useState('')
  const [pinMsg, setPinMsg] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const directUrl =
    typeof window !== 'undefined' && syncId
      ? `${window.location.origin}${window.location.pathname}?vault=${syncId}`
      : `?vault=${syncId}`

  const syncLabel: Record<SyncStatus, string> = {
    idle: 'Aguardando alterações',
    syncing: 'Sincronizando com nuvem...',
    synced: 'Sincronizado e Seguro',
    error: 'Aviso de sincronização (dados salvos localmente)',
    offline: 'Modo Offline (dados salvos localmente)',
  }

  const handlePinChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPin.length < 4 || newPin !== confirmNewPin) return
    const ok = await onChangePin(oldPin, newPin)
    if (ok) {
      setPinMsg('PIN alterado com sucesso!')
      setShowPinChange(false)
      setOldPin('')
      setNewPin('')
      setConfirmNewPin('')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const pin = prompt('Digite seu PIN para validar e importar:')
    if (pin) await onImport(text, pin)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleCopySyncId = async () => {
    if (!syncId) return
    await navigator.clipboard.writeText(syncId)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyUrl = async () => {
    if (!syncId) return
    await navigator.clipboard.writeText(directUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  return (
    <div className="settings-layout">
      {/* Seção 1: Código de Acesso e URL Única */}
      <div className="card">
        <p className="settings-section-title">Acesso Multi-dispositivo</p>

        {syncId ? (
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Para acessar seu cofre em outro aparelho (celular, tablet ou notebook), use o código numérico ou o link direto:
            </p>

            <div className="sync-code-box">
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                CÓDIGO NUMÉRICO DE 8 DÍGITOS
              </span>
              <code>{syncId}</code>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <button className="btn btn-primary btn-full" onClick={handleCopySyncId}>
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                {copiedCode ? 'Código Copiado!' : 'Copiar Código de Acesso (8 Dígitos)'}
              </button>

              <button className="btn btn-secondary btn-full" onClick={handleCopyUrl}>
                {copiedUrl ? <Check size={16} /> : <Link size={16} />}
                {copiedUrl ? 'Link Copiado!' : 'Copiar Link Direto'}
              </button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Nenhum código sincronizado no momento.
          </p>
        )}

        {cloudEnabled && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div className="sync-status-row">
              <Cloud size={18} />
              <span className={`sync-status sync-status--${syncStatus}`}>
                {syncLabel[syncStatus]}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Criptografia de conhecimento zero (Zero-Knowledge): o banco de dados armazena apenas payloads criptografados com PBKDF2 + AES-GCM.
            </p>
          </div>
        )}
      </div>

      {/* Seção 2: Segurança & PIN */}
      <div className="card">
        <p className="settings-section-title">Segurança & PIN</p>

        {!showPinChange ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Seu cofre está protegido pelo PIN pessoal. Você pode alterá-lo a qualquer momento.
            </p>
            {pinMsg && <p style={{ color: 'var(--green-400)', fontSize: '0.8125rem' }}>{pinMsg}</p>}
            <button
              className="btn btn-secondary btn-full"
              onClick={() => setShowPinChange(true)}
            >
              <KeyRound size={16} />
              Alterar PIN de Acesso
            </button>
          </div>
        ) : (
          <form onSubmit={handlePinChange} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">PIN Atual</label>
              <input
                type="password"
                className="pin-input"
                style={{ fontSize: '1.25rem', padding: '0.5rem' }}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="••••"
                maxLength={8}
                inputMode="numeric"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Novo PIN (mín. 4 dígitos)</label>
              <input
                type="password"
                className="pin-input"
                style={{ fontSize: '1.25rem', padding: '0.5rem' }}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="••••"
                maxLength={8}
                inputMode="numeric"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirmar Novo PIN</label>
              <input
                type="password"
                className="pin-input"
                style={{ fontSize: '1.25rem', padding: '0.5rem' }}
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="••••"
                maxLength={8}
                inputMode="numeric"
                required
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPinChange(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={newPin.length < 4 || newPin !== confirmNewPin}
              >
                Salvar Novo PIN
              </button>
            </div>
          </form>
        )}

        {/* Backup Manual */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <p className="settings-section-title">Backup Manual (JSON)</p>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <button className="btn btn-secondary btn-full" onClick={onExport}>
              <Download size={16} />
              Exportar
            </button>

            <button
              className="btn btn-secondary btn-full"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={16} />
              Importar
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
          </div>
        </div>

        {/* Bloquear Agora */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-danger btn-full" onClick={onLock}>
            <Lock size={16} />
            Bloquear Cofre Imediatamente
          </button>
        </div>
      </div>
    </div>
  )
}
