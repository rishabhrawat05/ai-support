import { streamLLMResponse } from "../ai/llm"
import { prisma } from "../db/prisma"

export async function supportAgent(message : string, conversationId: string){
    const history = await prisma.message.findMany({
            where: {conversationId},
            orderBy: {createdAt: 'asc'},
            take: 5
        })

        const context = history.map(m => `${m.role}: ${m.content}`).join('\n')

        const systemPrompt = ` You are a Support Agent in an AI-powered customer support system.
        You help users with FAQs, troubleshooting, and guidance. Use conversation history when relevant`

    return {
        agent: "Support Agent",
        stream: streamLLMResponse(systemPrompt, context + '\nuser: ' + message)
    }
}