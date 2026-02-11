import { prisma } from "../db/prisma";
import { billingAgent } from "./billing-agent.service";
import { orderAgent } from "./order-agent.service";
import { routeQuery } from "./router.agent";
import { supportAgent } from "./support-agent.service";


export async function handleChat(message: string, conversationId?: string){

    const conversation = conversationId ?? 
        (await prisma.conversation.create({ data: {} })).id

    await prisma.message.create({
        data:{
            role: 'user',
            content: message,
            conversationId: conversation
        }
    })

    const history = await prisma.message.findMany({
        where: { conversationId: conversation },
        orderBy: { createdAt: 'asc' },
        take: 10
    })
    
    const historyContext = history
        .map(m => `${m.role}${m.agent ? ` (${m.agent})` : ''}: ${m.content}`)
        .join('\n')

    const agentType = await routeQuery(message, historyContext)

    let agentResponse 

    switch(agentType){
        case "ORDER":
            agentResponse = await orderAgent(message, conversation)
            break
        case "BILLING":
            agentResponse = await billingAgent(message, conversation)
            break
        case "SUPPORT":
            agentResponse = await supportAgent(message, conversation)
            break
        default:
            throw new Error("Unknown agent type")
    }

    let fullText = ''
    for await (const chunk of agentResponse.stream.textStream) {
        fullText += chunk
    }

    if (!fullText || fullText.length === 0) {
        throw new Error('No content received from AI')
    }

    await prisma.message.create({
        data: {
            role: 'agent',
            content: fullText,
            agent: agentResponse.agent,
            conversationId: conversation
        }
    })

    return {
        conversationId: conversation,
        agent: agentResponse.agent,
        stream: {
            textStream: (async function*() {
                yield fullText
            })()
        }
    }
}