import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Visado',
  description: 'AI-powered relocation companion for Americans moving to Portugal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
