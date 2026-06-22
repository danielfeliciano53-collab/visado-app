import type { Metadata, Viewport } from 'next'
import './globals.css'
import { VaultProvider } from '../lib/vaultContext'

export const metadata: Metadata = {
  title: 'Visado',
  description: 'AI-powered relocation companion for Americans moving to Portugal',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VaultProvider>
          {children}
        </VaultProvider>
      </body>
    </html>
  )
}
