import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/lib/context/LanguageContext"
import { WalletProvider } from "@/lib/context/WalletContext"
import { ThemeProvider } from "@/lib/context/ThemeContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "RampWool | NFT Marketplace on Syscoin",
  description: "Marketplace NFT descentralizado con estética cyber en Syscoin y Rollux networks.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <WalletProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </WalletProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
