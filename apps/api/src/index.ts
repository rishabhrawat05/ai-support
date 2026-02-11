import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { healthController } from './controllers/health.controller'
import { chatController } from './controllers/chat.controller'
import { agentController } from './controllers/agent.controller'
import { errorMiddleware } from './middleware/error.middleware'

const app = new Hono()

// Enable CORS for frontend
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Mount individual controllers as RPC routes
app.route('/health', healthController)
app.route('/agents', agentController)
app.route('/chat', chatController)

app.use('*', errorMiddleware())

export default {
  port: 3001,
  fetch: app.fetch,
}

export type ApiType = typeof app
