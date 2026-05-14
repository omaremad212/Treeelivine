import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/contexts/AppContext'

export const metadata: Metadata = {
  title: 'Treeelivine ERP',
  description: 'Unified operations center for marketing agencies',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
