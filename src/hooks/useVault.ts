import { useState, useEffect, useCallback } from 'react'
import type { AppState, MediaItem } from '../types'
import { INITIAL_STATE } from '../types'
import {
  hashPin,
  generateSalt,
  saveEncrypted,
  loadDecrypted,
  loadEncryptedRaw,
  decryptData,
  verifyPin,
  createSessionKey,
  hasActiveSession,
  clearSession,
  exportData as exportRaw,
} from '../lib/crypto'
import {
  isCloudEnabled,
  getSyncId,
  setSyncId,
  generateSyncId,
  uploadToCloud,
  downloadFromCloud,
  UPDATED_AT_KEY,
  type SyncStatus,
} from '../lib/sync'
import { generateId, normalizeAppState } from '../lib/utils'

const SALT_KEY = 'media_vault_salt'

export interface UseVaultReturn {
  state: AppState | null
  isLocked: boolean
  isLoading: boolean
  error: string | null
  needsSetup: boolean
  cloudEnabled: boolean
  syncId: string | null
  syncStatus: SyncStatus
  pendingSyncCode: string | null
  initialUrlSyncId: string | null
  setup: (pin: string) => Promise<void>
  unlock: (pin: string) => Promise<boolean>
  restoreFromCloud: (syncId: string, pin: string) => Promise<boolean>
  lock: () => void
  addItem: (item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateItem: (id: string, updated: Partial<MediaItem>) => void
  deleteItem: (id: string) => void
  changePin: (oldPin: string, newPin: string) => Promise<boolean>
  exportBackup: () => void
  importBackup: (json: string, pin: string) => Promise<boolean>
  clearError: () => void
  clearPendingSyncCode: () => void
}

export function useVault(): UseVaultReturn {
  const [state, setState] = useState<AppState | null>(null)
  const [pin, setPin] = useState('')
  const [isLocked, setIsLocked] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [needsSetup, setNeedsSetup] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [pendingSyncCode, setPendingSyncCode] = useState<string | null>(null)
  const [initialUrlSyncId, setInitialUrlSyncId] = useState<string | null>(null)

  const cloudEnabled = isCloudEnabled()

  const syncToCloud = useCallback(async (salt: string) => {
    if (!isCloudEnabled()) return
    const syncId = getSyncId()
    const raw = loadEncryptedRaw()
    if (!syncId || !raw) return

    setSyncStatus('syncing')
    try {
      const now = new Date().toISOString()
      await uploadToCloud(syncId, raw, salt)
      localStorage.setItem(UPDATED_AT_KEY, now)
      setSyncStatus('synced')
    } catch {
      setSyncStatus('error')
    }
  }, [])

  const pullFromCloudIfNewer = useCallback(async (): Promise<boolean> => {
    if (!isCloudEnabled()) return false
    const syncId = getSyncId()
    if (!syncId) return false

    try {
      const cloud = await downloadFromCloud(syncId)
      if (!cloud) return false

      const localUpdated = localStorage.getItem(UPDATED_AT_KEY)
      if (!localUpdated || cloud.updatedAt > localUpdated) {
        localStorage.setItem('media_vault_encrypted', cloud.payload)
        localStorage.setItem(SALT_KEY, cloud.salt)
        localStorage.setItem(UPDATED_AT_KEY, cloud.updatedAt)
        return true
      }
    } catch {
      setSyncStatus('error')
    }
    return false
  }, [])

  const persist = useCallback(
    async (newState: AppState, currentPin: string) => {
      const { pinHash, salt, ...data } = newState
      await saveEncrypted(JSON.stringify(data), currentPin, salt!)
      setState(newState)
      await syncToCloud(salt!)
    },
    [syncToCloud]
  )

  useEffect(() => {
    // Detecta ?vault=12345678 na URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const urlVault = params.get('vault')
      if (urlVault && urlVault.trim()) {
        setInitialUrlSyncId(urlVault.trim())
      }
    }

    const raw = loadEncryptedRaw()
    if (!raw) {
      setNeedsSetup(true)
      setIsLocked(false)
      setIsLoading(false)
      return
    }
    if (!localStorage.getItem(SALT_KEY)) {
      setNeedsSetup(true)
      setIsLocked(false)
      setIsLoading(false)
      return
    }
    setNeedsSetup(false)
    setIsLocked(!hasActiveSession())
    setIsLoading(false)
  }, [])

  const setup = async (newPin: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const salt = await generateSalt()
      const pinHash = await hashPin(newPin, salt)
      localStorage.setItem(SALT_KEY, salt)

      const newState: AppState = {
        ...INITIAL_STATE,
        items: [],
        pinHash,
        salt,
        isSetup: true,
      }

      await saveEncrypted(
        JSON.stringify({
          items: [],
          isSetup: true,
        }),
        newPin,
        salt
      )

      if (isCloudEnabled()) {
        const syncId = generateSyncId()
        setSyncId(syncId)
        await syncToCloud(salt)
        setPendingSyncCode(syncId)
      }

      await createSessionKey(newPin, salt)
      setPin(newPin)
      setState(newState)
      setNeedsSetup(false)
      setIsLocked(false)
    } catch {
      setError('Erro ao configurar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const restoreFromCloud = async (inputSyncId: string, inputPin: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const cloud = await downloadFromCloud(inputSyncId.trim())
      if (!cloud) {
        setError('Código de sync não encontrado na nuvem.')
        return false
      }

      const decrypted = await decryptData(cloud.payload, inputPin, cloud.salt)
      if (!decrypted) {
        setError('Código ou PIN incorreto.')
        return false
      }

      const rawData = JSON.parse(decrypted)
      const normalized = normalizeAppState(rawData)
      const pinHash = await hashPin(inputPin, cloud.salt)

      localStorage.setItem('media_vault_encrypted', cloud.payload)
      localStorage.setItem(SALT_KEY, cloud.salt)
      localStorage.setItem(UPDATED_AT_KEY, cloud.updatedAt)
      setSyncId(inputSyncId.trim())

      await createSessionKey(inputPin, cloud.salt)
      setPin(inputPin)
      setState({
        ...normalized,
        pinHash,
        salt: cloud.salt,
        isSetup: true,
      })
      setNeedsSetup(false)
      setIsLocked(false)
      setSyncStatus('synced')
      return true
    } catch {
      setError('Código ou PIN incorreto.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const unlock = async (inputPin: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await pullFromCloudIfNewer()

      const salt = localStorage.getItem(SALT_KEY)
      if (!salt) {
        setError('Dados corrompidos.')
        return false
      }

      const decrypted = await loadDecrypted(inputPin, salt)
      if (!decrypted) {
        setError('PIN incorreto.')
        return false
      }

      const rawData = JSON.parse(decrypted)
      const normalized = normalizeAppState(rawData)
      const pinHash = await hashPin(inputPin, salt)

      await createSessionKey(inputPin, salt)
      setPin(inputPin)
      setState({
        ...normalized,
        pinHash,
        salt,
        isSetup: true,
      })
      setIsLocked(false)
      if (isCloudEnabled() && getSyncId()) setSyncStatus('synced')
      return true
    } catch {
      setError('PIN incorreto.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const lock = () => {
    clearSession()
    setIsLocked(true)
    setPin('')
    setState(null)
  }

  const addItem = (item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!state || !pin) return
    const now = new Date().toISOString()
    const newItem: MediaItem = {
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    const currentItems = state.items || []
    persist({ ...state, items: [newItem, ...currentItems] }, pin)
  }

  const updateItem = (id: string, updated: Partial<MediaItem>) => {
    if (!state || !pin) return
    const now = new Date().toISOString()
    const currentItems = state.items || []
    const newItems = currentItems.map((item) =>
      item.id === id ? { ...item, ...updated, updatedAt: now } : item
    )
    persist({ ...state, items: newItems }, pin)
  }

  const deleteItem = (id: string) => {
    if (!state || !pin) return
    const currentItems = state.items || []
    persist({ ...state, items: currentItems.filter((item) => item.id !== id) }, pin)
  }

  const changePin = async (oldPin: string, newPin: string): Promise<boolean> => {
    if (!state) return false
    const valid = await verifyPin(oldPin, state.salt!, state.pinHash!)
    if (!valid) {
      setError('PIN atual incorreto.')
      return false
    }
    const newSalt = await generateSalt()
    const newHash = await hashPin(newPin, newSalt)
    localStorage.setItem(SALT_KEY, newSalt)
    const newState = { ...state, pinHash: newHash, salt: newSalt }
    await persist(newState, newPin)
    setPin(newPin)
    return true
  }

  const exportBackup = () => {
    if (!state) return
    const { pinHash, salt, ...data } = state
    exportRaw(JSON.stringify(data, null, 2))
  }

  const importBackup = async (json: string, currentPin: string): Promise<boolean> => {
    try {
      const rawData = JSON.parse(json)
      const normalized = normalizeAppState(rawData)
      if (!state?.salt) return false
      await persist(
        {
          ...normalized,
          pinHash: state.pinHash,
          salt: state.salt,
          isSetup: true,
        },
        currentPin
      )
      return true
    } catch {
      setError('Arquivo de backup inválido.')
      return false
    }
  }

  return {
    state,
    isLocked,
    isLoading,
    error,
    needsSetup,
    cloudEnabled,
    syncId: getSyncId(),
    syncStatus,
    pendingSyncCode,
    initialUrlSyncId,
    setup,
    unlock,
    restoreFromCloud,
    lock,
    addItem,
    updateItem,
    deleteItem,
    changePin,
    exportBackup,
    importBackup,
    clearError: () => setError(null),
    clearPendingSyncCode: () => setPendingSyncCode(null),
  }
}
