'use client'

import { MessageCircle, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AIChatbot() {
  const handleOpenChat = () => {
    window.open(
      'https://teamhack2025.app.n8n.cloud/webhook/a2dbb0bd-9d3e-4736-a5d4-bc97913a6aa0/chat',
      'AI Chat Assistant',
      'width=400,height=600,resizable=yes,scrollbars=yes'
    )
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={handleOpenChat}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all hover:scale-110 group"
      title="Open AI Chat Assistant"
    >
      <div className="relative">
        <MessageCircle className="h-6 w-6" />
        <ExternalLink className="h-3 w-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.button>
  )
}
