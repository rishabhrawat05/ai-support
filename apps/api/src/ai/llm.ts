import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export function streamLLMResponse(
    systemPrompt: string,
    userMessage: string,
){
    return streamText({
        model: google('gemini-2.5-flash'),
        system: systemPrompt,
        prompt: userMessage,
    })
}