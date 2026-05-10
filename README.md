# EcoTrack Backend

A production-ready REST API for the EcoTrack platform — an AI-driven supply chain transparency and sustainability tracking system.

## Overview

EcoTrack Backend powers the core business logic for managing users, products, suppliers, orders, analytics, and AI-powered insights. Built with **Express.js** and **TypeScript**, it uses **Prisma ORM** with **PostgreSQL** for data persistence and is optimized for security, performance, and scalability.

## Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Language:** TypeScript
- **ORM:** Prisma (with PostgreSQL)
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt
- **AI Integration:** Google Generative AI
- **Validation:** Zod
- **Logging:** Winston
- **Build Tool:** tsup
- **Package Manager:** pnpm

## Features

- **Authentication & Authorization** — Secure JWT-based auth with role-based access control
- **User Management** — CRUD operations for platform users
- **Product Catalog** — Sustainable product listings with eco-scores
- **Supplier Management** — Supplier profiles, verification, and ratings
- **Order Processing** — End-to-end order lifecycle management
- **Analytics Dashboard** — Aggregated metrics and reporting
- **AI Insights** — Gemini-powered sustainability insights and recommendations
- **Chat Support** — Real-time conversational support module
- **Security Hardening** — Helmet, CORS, rate limiting, compression

## Project Structure

```
eco-track-backend-new/
├── src/
│   ├── app/
│   │   ├── modules/          # Domain modules (auth, users, products, etc.)
│   │   ├── utils/            # Shared utilities
│   │   └── builder/          # Query builders / helpers
│   ├── config/               # Environment & app configuration
│   ├── generated/              # Prisma generated client
│   ├── lib/                    # Singletons (Prisma client, etc.)
│   ├── middlewares/            # Express middlewares (auth, error, limiter, etc.)
│   ├── routes/                 # Centralized route definitions
│   ├── types/                  # Global TypeScript types
│   ├── app.ts                  # Express app configuration
│   └── server.ts               # Server bootstrap & graceful shutdown
├── prisma/
│   ├── schema/                 # Prisma schema files (split by domain)
│   └── migrations/             # Database migrations
├── dist/                       # Compiled output
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vercel.json                 # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd eco-track-backend-new

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL, JWT secret, and frontend URL
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecotrack"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
PORT=5000
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

### Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Seed the database
# pnpm tsx src/seed.ts
```

### Running the Server

```bash
# Development (with hot reload)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

The server will start at `http://localhost:5000`.

## API Endpoints

Base URL: `/api/v1`

| Module     | Endpoints                              |
|------------|----------------------------------------|
| Auth       | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` |
| Users      | `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id` |
| Products   | `GET /products`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id` |
| Suppliers  | `GET /suppliers`, `POST /suppliers`, `PATCH /suppliers/:id` |
| Orders     | `GET /orders`, `POST /orders`, `PATCH /orders/:id` |
| Analytics  | `GET /analytics/dashboard`, `GET /analytics/reports` |
| Chat       | `POST /chat/message`, `GET /chat/history` |
| AI Insight | `POST /ai-insight/analyze`, `GET /ai-insight/recommendations` |

## Scripts

| Script        | Description                          |
|---------------|--------------------------------------|
| `pnpm dev`    | Start development server with reload |
| `pnpm build`  | Build for production (CJS + ESM)     |
| `pnpm start`  | Run compiled production server        |

## Deployment

This project is configured for deployment on **Vercel** (`vercel.json` included). It can also be deployed to any Node.js hosting platform (Railway, Render, AWS, etc.).

```bash
# Deploy to Vercel
vercel --prod
```

## License

ISC
