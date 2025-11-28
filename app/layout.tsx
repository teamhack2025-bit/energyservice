import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AIChatbot from '@/components/chatbot/AIChatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Energy Customer Portal',
  description: 'Monitor your energy consumption and production',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AIChatbot />
      </body>
    </html>
  )
}

