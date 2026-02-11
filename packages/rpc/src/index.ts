// Re-export the API type for client usage
export type { ApiType as RpcAppType } from '../../../apps/api/src'

// Export client helper
export { createApiClient } from './client'

// Note: The actual RPC app is defined in apps/api/src/index.ts
// with controllers as implementations. Clients import this type
// and create the Hono client pointing to the API server.