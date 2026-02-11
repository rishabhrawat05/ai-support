# AI Support

A full-stack AI-powered customer support application built with modern technologies. This monorepo project provides an intelligent chat interface with multiple specialized AI agents for handling support, orders, and billing inquiries.

## Overview

AI Support is a comprehensive customer service platform that leverages artificial intelligence to provide automated assistance. The application features real-time streaming responses, conversation history management, and specialized AI agents for different support categories.

## Architecture

This project is structured as a Turborepo monorepo with the following components:

### Applications

- **api** - Backend API server built with Hono, providing RPC endpoints for chat, agents, and health checks
- **web** - Next.js frontend application with the main chat interface
- **docs** - Next.js documentation site

### Shared Packages

- **@repo/rpc** - Type-safe RPC client for frontend-backend communication
- **@repo/ui** - Shared React component library
- **@repo/eslint-config** - Shared ESLint configuration
- **@repo/typescript-config** - Shared TypeScript configuration

## Technology Stack

### Backend
- **Runtime:** Bun
- **Framework:** Hono
- **Database:** PostgreSQL with Prisma ORM
- **AI Integration:** Vercel AI SDK
- **Language:** TypeScript

### Frontend
- **Framework:** Next.js 16 with App Router
- **UI:** React 19 with CSS Modules
- **Type Safety:** TypeScript with Hono RPC Client
- **Language:** TypeScript

### Development Tools
- **Package Manager:** Bun 1.3.9
- **Build System:** Turborepo
- **Code Quality:** ESLint, Prettier
- **Database Tools:** Prisma

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Conversation** - Stores chat conversations
- **Message** - Individual messages within conversations (supports multiple agents)
- **Order** - Customer orders with status tracking (PENDING, CONFIRMED, SHIPPED, CANCELLED)
- **Payment** - Payment transactions with status tracking (INITIATED, SUCCESS, FAILED)

## Prerequisites

- Node.js 18 or higher
- Bun 1.3.9
- PostgreSQL database

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
bun install
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai-support"
```

For the web application, create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Database Setup

Run Prisma migrations to set up the database:

```bash
cd apps/api
bun run prisma migrate dev
bun run db:seed
```

### Development

Start all applications in development mode:

```bash
bun dev
```

This will start:
- API server on http://localhost:3001
- Web application on http://localhost:3000
- Documentation site on http://localhost:3003

To run a specific application:

```bash
# API only
turbo dev --filter=@repo/api

# Web only
turbo dev --filter=web

# Docs only
turbo dev --filter=docs
```

### Building

Build all applications:

```bash
bun run build
```

Build a specific application:

```bash
turbo build --filter=web
```

## Available Scripts

- `bun dev` - Start all applications in development mode
- `bun build` - Build all applications
- `bun lint` - Run ESLint across all packages
- `bun format` - Format code with Prettier
- `bun check-types` - Type check all packages

## API Endpoints

The backend API provides the following routes:

- `GET /health` - Health check endpoint
- `POST /agents` - Manage AI agents
- `POST /chat` - Handle chat messages with streaming support

## Features

### AI Agent System
Multiple specialized agents handle different types of inquiries:
- Support Agent - General customer support questions
- Order Agent - Order tracking and management
- Billing Agent - Payment and billing inquiries

### Real-time Chat
- Streaming AI responses for natural conversation flow
- Conversation history persistence
- Multi-agent support within single conversations

### Database Management
- Prisma ORM for type-safe database operations
- PostgreSQL for reliable data storage
- Automated migrations

### Type Safety
- End-to-end type safety with TypeScript
- RPC client for type-safe API calls
- Shared types across frontend and backend

## Project Structure

```
ai-support/
├── apps/
│   ├── api/          # Backend API server
│   ├── docs/         # Documentation site
│   └── web/          # Frontend application
├── packages/
│   ├── eslint-config/      # Shared ESLint config
│   ├── rpc/               # RPC client package
│   ├── typescript-config/ # Shared TypeScript config
│   └── ui/               # Shared UI components
├── package.json
├── turbo.json
└── bun.lock
```

## Development Workflow

1. Make your changes in the appropriate package or application
2. Run type checking: `bun check-types`
3. Run linting: `bun lint`
4. Format code: `bun format`
5. Test your changes locally with `bun dev`

## License

Private repository - All rights reserved
