import { streamLLMResponse } from "../ai/llm"
import { prisma } from "../db/prisma"
import { getPaymentsByOrderId } from "../services/payment.service"
import { getOrdersByConversationId } from "../services/order.service"

export async function billingAgent(message: string, conversationId: string) {
    const history = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 5
    })

    const context = history.map(m => `${m.role}: ${m.content}`).join('\n')

    const orders = await getOrdersByConversationId(conversationId)
    let billingData = "No orders found for this conversation."

    if (orders.length > 0) {
        const ordersWithPayments = await Promise.all(
            orders.map(async (o) => {
                const payments = await getPaymentsByOrderId(o.id)
                return {
                    orderNumber: o.orderNumber,
                    status: o.status,
                    amount: o.amount,
                    currency: o.currency,
                    payments: payments.map(p => ({
                        amount: p.amount,
                        status: p.status,
                        method: p.method,
                        createdAt: p.createdAt
                    }))
                }
            })
        )
        billingData = JSON.stringify(ordersWithPayments, null, 2)
    }

    const systemPrompt = `You are a Billing Agent in an AI-powered customer support system.
You help users check invoice status, process refunds, and handle billing issues.
Use conversation history when relevant.

Here are the orders and payment data for this conversation:
${billingData}

Provide helpful responses based on this billing data.`

    return {
        agent: "Billing Agent",
        stream: streamLLMResponse(systemPrompt, context + '\nuser: ' + message),
    }
}