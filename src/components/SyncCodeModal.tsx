import { useState } from 'react'
import { Cloud, Copy, Check, X, Link } from 'lucide-react'

interface SyncCodeModalProps {
  syncCode: string
  onClose: () => void
}

export function SyncCodeModal({ syncCode, onClose }: SyncCodeModalProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const directUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?vault=${syncCode}`
      : `?vault=${syncCode}`

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(syncCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(directUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>

        <div className="modal-icon">
          <Cloud size={28} />
        </div>

        <h2 className="modal-title">Seu Cofre Foi Criado!</h2>
        <p className="modal-desc">
          Guarde este código único de acesso. Para entrar em outro aparelho, basta informá-lo junto com seu PIN pessoal.
        </p>

        <div className="sync-code-box">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            CÓDIGO NUMÉRICO DE ACESSO
          </span>
          <code>{syncCode}</code>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
          <button className="btn btn-primary btn-full" onClick={handleCopyCode}>
            {copiedCode ? <Check size={16} /> : <Copy size={16} />}
            {copiedCode ? 'Código Copiado!' : 'Copiar Código Numérico'}
          </button>

          <button className="btn btn-secondary btn-full" onClick={handleCopyUrl}>
            {copiedUrl ? <Check size={16} /> : <Link size={16} />}
            {copiedUrl ? 'Link de Acesso Copiado!' : 'Copiar Link Direto'}
          </button>
        </div>

        <p className="modal-warning">
          Seus dados são protegidos por criptografia de ponta a ponta no seu dispositivo. Somente quem possuir este código + seu PIN conseguirá decodificar seus dados.
        </p>
      </div>
    </div>
  )
}
