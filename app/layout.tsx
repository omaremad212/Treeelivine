import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Treelivine ERP",
    template: "%s | Treelivine ERP",
  },
  description: "Enterprise Resource Planning system for modern businesses",
  keywords: ["ERP", "business management", "inventory", "orders", "CRM"],
  authors: [{ name: "Treelivine" }],
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans h-full bg-[#0D0F12] text-[#F8FAFC] antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
