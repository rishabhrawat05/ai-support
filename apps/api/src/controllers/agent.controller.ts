import { Hono } from "hono";
import { getAgentCapabilitiesByType, getAllAgents } from "../services/agent.service";

export const agentController = new Hono()

agentController.get('/', async (c) => {
    return c.json(getAllAgents())
})

agentController.get('/:type/capabilities', async (c) => {
    const type = c.req.param('type')
    return c.json(await getAgentCapabilitiesByType(type))
})