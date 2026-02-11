export type AgentType = 'SUPPORT' | 'ORDER' | 'BILLING'

export const AGENTS = {
  support: {
    type: 'SUPPORT',
    name: 'Support Agent',
    description: 'Handles general support, FAQs, and troubleshooting',
    capabilities: [
      'Answer FAQs',
      'Troubleshoot issues',
      'Use conversation history'
    ],
    tools: ['queryConversationHistory']
  },

  order: {
    type: 'ORDER',
    name: 'Order Agent',
    description: 'Handles order tracking, status, and modifications',
    capabilities: [
      'Track orders',
      'Check delivery status',
      'Cancel or modify orders'
    ],
    tools: ['fetchOrderDetails', 'checkDeliveryStatus']
  },

  billing: {
    type: 'BILLING',
    name: 'Billing Agent',
    description: 'Handles payments, refunds, invoices, and subscriptions',
    capabilities: [
      'Check invoice status',
      'Process refunds',
      'Handle billing issues'
    ],
    tools: ['getInvoiceDetails', 'checkRefundStatus']
  }
}