-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    agent TEXT,
    "conversationId" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT messages_conversation_fkey 
        FOREIGN KEY ("conversationId") 
        REFERENCES conversations(id) 
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages("conversationId");
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages("createdAt");
CREATE INDEX IF NOT EXISTS conversations_created_at_idx ON conversations("createdAt");
