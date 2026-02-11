import { AGENTS } from "../agents/agent.registry"
import { prisma } from "../db/prisma"

export function getAllAgents(){
    const agents = Object.values(AGENTS).map((agent) => ({
        type: agent.type,
        name: agent.name,
        description: agent.description
    }))

    return agents
}

export async function getAgentCapabilitiesByType(type: string){

    const agent = AGENTS[type as keyof typeof AGENTS]

    if (!agent) {
        throw { status: 404, message: 'Agent not found' }
    }

    return {
        type: agent.type,
        name: agent.name,
        capabilities: agent.capabilities
    }
}