import { Hono } from "hono";
import { stream} from "hono/streaming";
import { handleChat } from "../agents/router-agent.service";
import { deleteConversationById, getAllConversations, getConversationById } from "../services/chat.service";

export const chatController = new Hono()

chatController.post("/messages", async (c) => {
    try {
        console.log('Received message request')
        const body = await c.req.json();
        console.log('Request body:', body)

        const response = await handleChat(body.message, body.conversationId)
        console.log('Chat response:', { conversationId: response.conversationId, agent: response.agent })
        
        if('stream' in response){
            console.log('Streaming response...')
            return stream(c, async(stream) =>{
                for await (const chunk of response.stream.textStream) {
                    console.log('Streaming chunk:', chunk)
                    await stream.write(chunk)
                }
                console.log('Stream complete')
            })
        }
        return c.json({response})
    } catch (error) {
        console.error('Error in chat controller:', error)
        return c.json({ error: 'Internal server error' }, 500)
    }
})

chatController.get("/conversations", async (c) => {
    const conversations = await getAllConversations()
    return c.json(conversations)
})

chatController.get("/conversations/:id", async (c) => {
    const id = c.req.param('id');
    return c.json(await getConversationById(id))
})

chatController.delete("/conversations/:id", async (c) => {
    const id = c.req.param('id');
    return c.json(await deleteConversationById(id))
})