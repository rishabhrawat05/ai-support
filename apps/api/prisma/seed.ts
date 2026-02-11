import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting to seed database...')

  const conversation1 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            role: 'user',
            content: 'I want to order a laptop',
          },
          {
            role: 'agent',
            content: 'Great! I can help you with that. Let me create an order for you.',
            agent: 'Order Agent',
          },
        ],
      },
      orders: {
        create: [
          {
            orderNumber: 'ORD-12345',
            status: 'SHIPPED',
            amount: 1299.99,
            currency: 'USD',
            payment: {
              create: {
                amount: 1299.99,
                status: 'SUCCESS',
                method: 'credit_card',
              },
            },
          },
        ],
      },
    },
  })

  const conversation2 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            role: 'user',
            content: 'I need to check my order status',
          },
          {
            role: 'agent',
            content: 'I can help you check your order status. What is your order number?',
            agent: 'Order Agent',
          },
        ],
      },
      orders: {
        create: [
          {
            orderNumber: 'ORD-67890',
            status: 'CONFIRMED',
            amount: 599.50,
            currency: 'USD',
            payment: {
              create: {
                amount: 599.50,
                status: 'SUCCESS',
                method: 'paypal',
              },
            },
          },
        ],
      },
    },
  })

  const conversation3 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            role: 'user',
            content: 'I want to order wireless headphones',
          },
          {
            role: 'agent',
            content: 'Perfect! Let me help you place an order for wireless headphones.',
            agent: 'Order Agent',
          },
        ],
      },
      orders: {
        create: [
          {
            orderNumber: 'ORD-11111',
            status: 'PENDING',
            amount: 249.99,
            currency: 'USD',
            payment: {
              create: {
                amount: 249.99,
                status: 'INITIATED',
                method: 'credit_card',
              },
            },
          },
        ],
      },
    },
  })

  const conversation4 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            role: 'user',
            content: 'Track my shoe order',
          },
          {
            role: 'agent',
            content: 'I can help you track your shoe order. Please provide the order number.',
            agent: 'Order Agent',
          },
        ],
      },
      orders: {
        create: [
          {
            orderNumber: 'ORD-22222',
            status: 'SHIPPED',
            amount: 89.99,
            currency: 'USD',
            payment: {
              create: {
                amount: 89.99,
                status: 'SUCCESS',
                method: 'debit_card',
              },
            },
          },
        ],
      },
    },
  })

  const conversation5 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            role: 'user',
            content: 'I need to cancel my order',
          },
          {
            role: 'agent',
            content: 'I understand you want to cancel your order. Let me help you with that.',
            agent: 'Order Agent',
          },
        ],
      },
      orders: {
        create: [
          {
            orderNumber: 'ORD-33333',
            status: 'CANCELLED',
            amount: 149.99,
            currency: 'USD',
            payment: {
              create: [
                {
                  amount: 149.99,
                  status: 'SUCCESS',
                  method: 'credit_card',
                },
                {
                  amount: 149.99,
                  status: 'SUCCESS',
                  method: 'refund',
                },
              ],
            },
          },
        ],
      },
    },
  })

  const conversation6 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            role: 'user',
            content: 'My payment failed for my order',
          },
          {
            role: 'agent',
            content: 'I see your payment encountered an issue. Let me help you resolve this.',
            agent: 'Billing Agent',
          },
        ],
      },
      orders: {
        create: [
          {
            orderNumber: 'ORD-44444',
            status: 'PENDING',
            amount: 799.00,
            currency: 'USD',
            payment: {
              create: {
                amount: 799.00,
                status: 'FAILED',
                method: 'credit_card',
              },
            },
          },
        ],
      },
    },
  })

  console.log('Database seeded successfully!')
  console.log('Created conversations:', {
    conversation1: conversation1.id,
    conversation2: conversation2.id,
    conversation3: conversation3.id,
    conversation4: conversation4.id,
    conversation5: conversation5.id,
    conversation6: conversation6.id,
  })
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
