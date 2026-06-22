'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { deriveKey } from './vaultCrypto'

interface VaultContextType {
  isUnlocked: boolean
  unlock: (password: string, userId: string) => Promise<void>
  lock: () => void
  getKey: () => CryptoKey | null
}

const VaultContext = createContext<VaultContextType | null>(null)

export function VaultProvider({ children }: { children: ReactNode }) {
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null)

  const unlock = useCallback(async (password: string, userId: string) => {
    const key = await deriveKey(password, userId)
    setCryptoKey(key)
  }, [])

  const lock = useCallback(() => {
    setCryptoKey(null)
  }, [])

  const getKey = useCallback(() => cryptoKey, [cryptoKey])

  return (
    <VaultContext.Provider value={{ isUnlocked: !!cryptoKey, unlock, lock, getKey }}>
      {children}
    </VaultContext.Provider>
  )
}

export function useVault() {
  const ctx = useContext(VaultContext)
  if (!ctx) throw new Error('useVault must be used within a VaultProvider')
  return ctx
}
