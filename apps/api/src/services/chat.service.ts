import { prisma } from "../db/prisma"

export async function getConversationById(id: string){
    const conversation = await prisma.conversation.findUnique({
            where: {id},
            include: {
                messages: {
                    orderBy: {createdAt: 'asc'}
                }
            }
        })
    
        if (!conversation) {
            throw { status: 404, message: 'Conversation not found' }
        }
    
        return {
            id: conversation.id,
            createdAt: conversation.createdAt,
            messages: conversation.messages
        }
}

export async function getAllConversations(){
    const conversations = await prisma.conversation.findMany({
        include: {
            messages: {
                orderBy: {createdAt: 'asc'}
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const result = conversations.map((c) => ({
        id: c.id,
        createdAt: c.createdAt,
        messages: c.messages
    }))

    return result
}

export async function deleteConversationById(id: string){
    const conversation = await prisma.conversation.findUnique({
        where: {id}
    })

    if (!conversation) {
        throw { status: 404, message: 'Conversation not found' }
    }

    await prisma.message.deleteMany({
        where: {conversationId: id}
    })

    await prisma.conversation.delete({
        where: {id}
    })

    return {success: true, message: "Conversation Deleted Successfully"}
}