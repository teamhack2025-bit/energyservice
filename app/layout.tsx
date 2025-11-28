import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AIChatbot from '@/components/chatbot/AIChatbot'
import * as Sentry from '@sentry/nextjs'

const inter = Inter({ subsets: ['latin'] })

export function generateMetadata(): Metadata {
  return {
    title: 'Watts Next',
    description: 'Monitor your energy consumption and production',
    other: {
      ...Sentry.getTraceData()
    }
  }
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

