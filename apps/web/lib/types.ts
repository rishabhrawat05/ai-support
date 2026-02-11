export interface Message {
  id: string
  role: string
  content: string
  agent: string | null
  conversationId: string
  createdAt: Date | string
}

export interface Conversation {
  id: string
  createdAt: Date | string
  messages: Message[]
}

export interface Agent {
  type: string
  name: string
  description: string
}

export interface AgentCapabilities {
  type: string
  name: string
  capabilities: string[]
}
