import { Hono } from "hono";

export const healthController = new Hono()

healthController.get('/', (c) => {
    return c.json({status: 'ok'})
})