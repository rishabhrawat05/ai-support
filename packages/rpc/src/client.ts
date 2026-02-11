import { hc } from 'hono/client'
import type { RpcAppType } from './index'

// Example: Create a type-safe RPC client for your API
// Usage in your frontend or another service:
//
// const client = createApiClient('http://localhost:3000')
//
// // Now you have full type-safety for your API routes
// const response = await client.health.$get()
// const data = await response.json()

export function createApiClient(baseUrl: string) {
  return hc<RpcAppType>(baseUrl)
}
