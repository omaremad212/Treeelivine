import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/contexts/AppContext'

export const metadata: Metadata = {
  title: 'Treeelivine ERP — نظام إدارة الوكالات',
  description: 'منصة ERP متكاملة لإدارة وكالات التسويق والشركات الخدمية — عملاء، مشاريع، مهام، مالية.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#4f6831" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
