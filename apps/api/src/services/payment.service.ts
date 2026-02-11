import { prisma } from "../db/prisma"
import { PaymentStatus } from "../generated/prisma/index.js"

export async function createPayment(input: {orderId: string, amount: number, method: string, status?: PaymentStatus}) {
    const payment = await prisma.payment.create({
        data: {
            orderId: input.orderId,
            amount: input.amount,
            method: input.method,
            status: input.status || PaymentStatus.INITIATED
        }
    })
    return payment
}

export async function getPaymentsByOrderId(orderId: string) {
    const payments = await prisma.payment.findMany({
        where: { orderId }
    })
    return payments
}