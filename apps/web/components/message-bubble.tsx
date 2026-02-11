'use client'

import { Message } from '@/lib/types'
import styles from './message-bubble.module.css'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const timestamp = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className={`${styles.messageContainer} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.bubble}>
        {!isUser && message.agent && (
          <div className={styles.agentBadge}>
            {message.agent}
          </div>
        )}
        <div className={styles.content}>
          {message.content}
        </div>
        <div className={styles.timestamp}>
          {timestamp}
        </div>
      </div>
    </div>
  )
}
