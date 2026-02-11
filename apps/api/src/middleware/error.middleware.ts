import { Context } from 'hono'
import { Prisma } from '../generated/prisma/client'


export function errorMiddleware() {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next()
    } catch (err: any) {
      console.error('Error:', err)

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return c.json(
          {
            error: 'Database error',
            code: err.code,
            message: err.message
          },
          400
        )
      }

      if (err?.name === 'ZodError') {
        return c.json(
          {
            error: 'Validation failed',
            issues: err.issues
          },
          422
        )
      }

      if (err?.status) {
        return c.json(
          {
            error: err.message || 'Request failed'
          },
          err.status
        )
      }

      return c.json(
        {
          error: 'Internal Server Error'
        },
        500
      )
    }
  }
}