import { streamLLMResponse } from "../ai/llm";
import { prisma } from "../db/prisma";
import { getOrdersByConversationId } from "../services/order.service";

export async function orderAgent(message: string, conversationId: string) {
  const history = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 5,
  });

  const context = history.map((m) => `${m.role}: ${m.content}`).join("\n");

  const orders = await getOrdersByConversationId(conversationId);
  const orderData = orders.length > 0
    ? JSON.stringify(orders.map(o => ({
        orderNumber: o.orderNumber,
        status: o.status,
        amount: o.amount,
        currency: o.currency,
        createdAt: o.createdAt,
      })), null, 2)
    : "No orders found for this conversation.";

  const orderNumberMatch = message.match(/ORD-\w+/i);
  let specificOrder = null;
  if (orderNumberMatch) {
    specificOrder = await prisma.order.findUnique({
      where: { orderNumber: orderNumberMatch[0] },
      include: { payment: true },
    });
  }

  const systemPrompt = `You are an Order Agent in an AI-powered customer support system.
You help users track orders, check delivery status, cancel or modify orders.
Use conversation history when relevant.

Here are the orders for this conversation:
${orderData}
${specificOrder ? `\nSpecific order details:\n${JSON.stringify(specificOrder, null, 2)}` : ''}

Provide helpful responses based on this order data.`;

  return {
    agent: "Order Agent",
    stream: streamLLMResponse(systemPrompt, context + "\nuser: " + message),
  };
}
