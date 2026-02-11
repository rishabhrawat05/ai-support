import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

export type AgentType = 'SUPPORT' | 'ORDER' | 'BILLING'

export async function routeQuery(message: string, conversationHistory?: string): Promise<AgentType> {
    const systemPrompt = `You are a routing agent in a customer support system. 
Your job is to analyze the user's message and conversation history to determine which specialized agent should handle it.

Available agents:
- ORDER: Handles order placement, tracking, delivery status, shipping addresses, cancellations, and order modifications
- BILLING: Handles payment issues, refunds, invoices, charges, and billing disputes for EXISTING orders
- SUPPORT: Handles general questions, FAQs, account issues, and anything that doesn't fit the other categories

When a user is placing a NEW order and mentions payment methods, route to ORDER (not BILLING).
Consider the conversation context - if they've been talking about orders, keep routing to ORDER even if they mention payment.`

    const context = conversationHistory 
        ? `Conversation history:\n${conversationHistory}\n\nNew message: ${message}`
        : `Message: ${message}`

    try {
        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            prompt: context,
            schema: z.object({
                agent: z.enum(['ORDER', 'BILLING', 'SUPPORT']).describe('The agent that should handle this request'),
                reasoning: z.string().describe('Brief explanation of why this agent was chosen')
            })
        })

        console.log(`Router decision: ${result.object.agent} - ${result.object.reasoning}`)
        return result.object.agent as AgentType
    } catch (error) {
        console.error('Error in dynamic routing, falling back to keyword-based routing:', error)
        return fallbackRouting(message)
    }
}

function fallbackRouting(message: string): AgentType {
    const text = message.toLowerCase()

    if(text.includes('order') || text.includes('delivery') || text.includes("track") || 
       text.includes('address') || text.includes('shipping') || text.includes('ship') ||
       text.includes('buy') || text.includes('purchase') || text.includes('place')){
        return "ORDER"
    }

    if(text.includes("refund") || text.includes("invoice") || text.includes("billing") || 
       text.includes("charge")){
        return "BILLING"
    }

    return "SUPPORT"
}