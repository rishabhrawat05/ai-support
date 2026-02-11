'use client'

import { Conversation } from '@/lib/types'
import styles from './conversation-list.module.css'

interface ConversationListProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
}

export function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation
}: ConversationListProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Conversations</h2>
        <button
          className={styles.newButton}
          onClick={onNewConversation}
          title="New Conversation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
      
      <div className={styles.list}>
        {!Array.isArray(conversations) || conversations.length === 0 ? (
          <div className={styles.empty}>
            No conversations yet
          </div>
        ) : (
          conversations.map((conversation) => {
            const preview = conversation.messages[0]?.content || 'New conversation'
            const date = new Date(conversation.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })
            
            return (
              <div
                key={conversation.id}
                className={`${styles.item} ${conversation.id === currentConversationId ? styles.active : ''}`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className={styles.itemContent}>
                  <div className={styles.itemPreview}>{preview}</div>
                  <div className={styles.itemDate}>{date}</div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Delete this conversation?')) {
                      onDeleteConversation(conversation.id)
                    }
                  }}
                  title="Delete conversation"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
