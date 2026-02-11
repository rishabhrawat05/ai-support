# AI Support Frontend

This is the web frontend for the AI Support chat application.

## Features

- 🤖 AI-powered chat with multiple specialized agents (Support, Order, Billing)
- 💬 Real-time streaming responses
- 📝 Conversation history management
- 🎨 Beautiful, responsive UI with dark mode support
- ⚡ Type-safe API client with Hono RPC

## Getting Started

First, install dependencies and configure the environment:

```bash
bun install
```

Create a `.env.local` file with your API URL:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Important:** Make sure the backend API is running on port 3001 before starting the frontend.

## Architecture

- **Framework:** Next.js 16 with App Router
- **Type Safety:** TypeScript with RPC client
- **Styling:** CSS Modules with CSS Variables
- **API Client:** Hono RPC Client (`@repo/rpc`)

## Components

- `ChatInterface` - Main chat UI with message input and display
- `ConversationList` - Sidebar for managing conversations
- `MessageBubble` - Individual message component with role-based styling

## Available Scripts

- `bun dev` - Start development server (port 3000)
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun check-types` - Type check the project

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

