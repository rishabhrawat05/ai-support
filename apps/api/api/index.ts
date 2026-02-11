import { handle } from '@hono/node-server/vercel'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { healthController } from '../src/controllers/health.controller'
import { chatController } from '../src/controllers/chat.controller'
import { agentController } from '../src/controllers/agent.controller'
import { errorMiddleware } from '../src/middleware/error.middleware'

const app = new Hono()

// Enable CORS for frontend
app.use('*', cors({
  origin: (origin) => {
    // Allow localhost for dev and any vercel.app domain
    if (!origin) return '*'
    if (origin.includes('localhost')) return origin
    if (origin.endsWith('.vercel.app')) return origin
    return '*'
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Mount controllers
app.route('/health', healthController)
app.route('/agents', agentController)
app.route('/chat', chatController)

app.use('*', errorMiddleware())

export default handle(app)
