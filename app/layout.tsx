import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Treelivine ERP — Run Your Business From One Platform",
    template: "%s | Treelivine ERP",
  },
  description:
    "Treelivine ERP helps businesses manage sales, inventory, finance, customers, suppliers, and reports from one modern dashboard.",
  keywords: ["ERP", "business management", "inventory", "orders", "CRM", "finance"],
  authors: [{ name: "Treelivine" }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
