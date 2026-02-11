import {prisma} from "../db/prisma"
import { OrderStatus } from "../generated/prisma/index.js"
export async function createOrder(input: {orderNumber: string, amount: number, currency: string, conversationId: string, status?: OrderStatus}) {
    const order = await prisma.order.create({
        data: {
            conversationId: input.conversationId,
            amount: input.amount,
            currency: input.currency,
            orderNumber: input.orderNumber,
            status: input.status || OrderStatus.PENDING
        }
    })
    return order
}

export async function getOrdersByConversationId(conversationId: string) {
    const orders = await prisma.order.findMany({
        where: { conversationId }
    })
    return orders
}