'use client'

import { useEffect, useState } from 'react'
import { formatTime, formatDateTime } from '@/lib/utils/dateFormatter'

interface ClientTimeProps {
  date: Date | string
  format?: 'time' | 'datetime'
}

export default function ClientTime({ date, format = 'datetime' }: ClientTimeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder during SSR to prevent hydration mismatch
    return <span>Loading...</span>
  }

  const formattedDate = format === 'time' 
    ? formatTime(date)
    : formatDateTime(date)

  return <span>{formattedDate}</span>
}
