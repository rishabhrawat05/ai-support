'use client'

import { useState, useEffect } from 'react'
import { ChatInterface } from '@/components/chat-interface'
import { ConversationList } from '@/components/conversation-list'
import { apiClient  } from '@/lib/api-client' 
import { Conversation } from '@/lib/types'
import styles from './page.module.css'
import { Message } from '../../api/src/generated/prisma'

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      console.log('Loading conversations...')
      const response = await (apiClient as any).chat.conversations.$get()
      const data = await response.json()
      console.log('Loaded conversations:', data)
      setConversations(Array.isArray(data) ? data as Conversation[] : [])
    } catch (error) {
      console.error('Failed to load conversations:', error)
      setConversations([])
    }
  }

  const loadConversation = async (id: string) => {
    try {
      const response = await (apiClient as any).chat.conversations[':id'].$get({
        param: { id }
      })
      const data = await response.json()
      setCurrentConversation(data as Conversation)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const handleSendMessage = async (message: string) => {
    setIsLoading(true)
    
    try {
      console.log('Sending message:', message)
      
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        agent: null,
        conversationId: currentConversation?.id || 'temp',
        createdAt: new Date()
      }

      if (currentConversation) {
        setCurrentConversation({
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage]
        })
      } else {
        setCurrentConversation({
          id: 'temp',
          createdAt: new Date(),
          messages: [userMessage]
        })
      }
      
      const response = await (apiClient as any).chat.messages.$post({
        json: {
          message,
          conversationId: currentConversation?.id && currentConversation.id !== 'temp' ? currentConversation.id : undefined
        }
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      const reader = response.body?.getReader()
      if (!reader) {
        console.error('No reader available')
        return
      }

      const decoder = new TextDecoder()
      let assistantMessage = ''

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        agent: 'AI',
        conversationId: currentConversation?.id || 'temp',
        createdAt: new Date()
      }

      console.log('Starting to read stream...')
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log('Stream done, total message:', assistantMessage)
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        console.log('Received chunk:', chunk)
        assistantMessage += chunk
        assistantMsg.content = assistantMessage
        setCurrentConversation((prev: Conversation | null) => {
          if (!prev) return prev
          const messages = [...prev.messages]
          const lastMsg = messages[messages.length - 1]
          if (lastMsg && lastMsg.role === 'assistant') {
            messages[messages.length - 1] = { ...assistantMsg }
          } else {
            messages.push({ ...assistantMsg })
          }
          return { ...prev, messages }
        })
      }
      await loadConversations()
      
      if (!currentConversation || currentConversation.id === 'temp') {
        const response = await (apiClient as any).chat.conversations.$get()
        const data = await response.json() as Conversation[]
        const latest = data[0]
        if (latest) {
          await loadConversation(latest.id)
        }
      } else {
        await loadConversation(currentConversation.id)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    setCurrentConversation(null)
  }

  const handleSelectConversation = async (id: string) => {
    await loadConversation(id)
  }

  const handleDeleteConversation = async (id: string) => {
    try {
      await (apiClient as any).chat.conversations[':id'].$delete({
        param: { id }
      })
    
      setConversations(conversations.filter(c => c.id !== id))

      if (currentConversation?.id === id) {
        setCurrentConversation(null)
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.menuButton}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title="Toggle sidebar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversation?.id || null}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      <div className={styles.main}>
        <ChatInterface
          conversationId={currentConversation?.id || null}
          messages={currentConversation?.messages || []}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
