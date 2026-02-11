'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from '@/lib/types'
import { MessageBubble } from './message-bubble'
import styles from './chat-interface.module.css'

interface ChatInterfaceProps {
  conversationId: string | null
  messages: Message[]
  onSendMessage: (message: string) => Promise<void>
  isLoading: boolean
}

export function ChatInterface({
  conversationId,
  messages,
  onSendMessage,
  isLoading
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput('')
    
    await onSendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={styles.container}>
      {messages.length === 0 ? (
        <div className={styles.welcome}>
          <div className={styles.welcomeIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <h1 className={styles.welcomeTitle}>AI Support Chat</h1>
          <p className={styles.welcomeText}>
            Ask me anything! I can help with support questions, order tracking, and billing issues.
          </p>
          <div className={styles.suggestions}>
            <button
              className={styles.suggestionButton}
              onClick={() => setInput('Track my order')}
            >
              Track my order
            </button>
            <button
              className={styles.suggestionButton}
              onClick={() => setInput('How do I return an item?')}
            >
              How do I return an item?
            </button>
            <button
              className={styles.suggestionButton}
              onClick={() => setInput('Check my invoice status')}
            >
              Check my invoice status
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.messages}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className={styles.typingIndicator}>
              thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!input.trim() || isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  )
}
