import { createApiClient } from "@repo/rpc/index" 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const apiClient = createApiClient(API_BASE_URL)
