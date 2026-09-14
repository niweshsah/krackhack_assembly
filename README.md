# TicketChain

TicketChain is a full-stack event ticketing platform for organizers and attendees. It combines secure account management, event publishing, relational ticket inventory, reservation protection, and an isolated Aptos NFT module for future digital ticket ownership.

The project is structured as a technical product submission: the core web application is backed by PostgreSQL and Prisma, while the blockchain work is kept modular and independently buildable.

## Product Vision

Ticketing systems are deceptively difficult. A useful platform must protect limited inventory under concurrent demand, preserve a reliable record of ownership and reservations, and provide a smooth experience for both event organizers and attendees.

TicketChain addresses that problem through:

- organizer and attendee account flows
- role-aware API authorization
- event and ticket inventory management
- transaction-safe ticket reservations
- refresh-token-based session handling
- a future-ready Aptos NFT integration

## Why This Project Matters

TicketChain goes beyond a basic CRUD application. Its strongest engineering decisions are concentrated around the parts of ticketing that create real operational risk:

- **Inventory integrity:** reservations update ticket availability atomically to reduce double-booking and overselling risk.
- **Relational domain modeling:** users, organizers, venues, events, ticket types, tickets, reservations, orders, payments, transfers, and royalties are represented explicitly in PostgreSQL.
- **Authentication discipline:** passwords are hashed, access is JWT-protected, refresh tokens are rotated and revocable, and protected routes enforce roles.
- **Migration clarity:** the active backend data path is unified on Prisma and PostgreSQL rather than maintaining parallel database implementations.
- **Blockchain isolation:** Aptos functionality is separated from the web runtime so it can evolve without coupling experimental wallet logic to the core API.

## Architecture

```mermaid
flowchart LR
    User[Attendee or Organizer] --> Web[React + Vite Frontend]
    Web --> API[Express REST API]
    API --> Auth[JWT and bcrypt Auth]
    API --> Prisma[Prisma ORM]
    Prisma --> Postgres[(PostgreSQL)]
    API -. future integration .-> NFT[Aptos NFT Module]
    NFT --> Aptos[Aptos Testnet]
```

### Frontend

The frontend is a React and Vite application responsible for authentication screens, event discovery, event creation, profile views, and ticket-related actions. API configuration is centralized through the frontend environment setup.

### Backend

The backend is an Express REST API mounted under `/api/v1`. It contains authentication services, role-aware middleware, event controllers, reservation logic, and Prisma database access.

### Database

PostgreSQL is the active persistence layer, accessed through Prisma. The schema is designed for future commerce and ownership workflows, not only the first reservation use case.

### NFT Module

The [nft_code](nft_code) folder is an independently buildable Aptos module. Its TypeScript implementation is organized around:

- transaction submission and retry infrastructure
- account funding and balance services
- collection creation and ticket minting
- ticket transfer, purchase, and resale royalty services
- a separate Move package for future on-chain logic

## Core Features

### Authentication and authorization

- User registration and login
- bcrypt password hashing
- JWT access tokens
- refresh token rotation and revocation
- bearer authentication middleware
- organizer and admin role checks

### Event management

- Organizer event creation
- Venue and event relationships
- Ticket category and inventory creation
- Event listing and name filtering
- Event reviews
- Event completion workflow

### Reservation protection

- Atomic availability updates
- Reservation records with expiration timestamps
- Conflict responses for unavailable tickets
- Compatibility with ticket-category IDs and individual ticket IDs

### Blockchain direction

- Aptos collection creation
- Ticket NFT minting
- Digital asset ownership lookup
- Ticket transfers
- Purchase payment flow
- Resale royalty flow

The blockchain module is currently a prototype and is not yet synchronized with the PostgreSQL inventory system.

## Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, Redux-style state management |
| Backend | Node.js, Express |
| Authentication | JWT, bcrypt, refresh tokens |
| Database | PostgreSQL, Prisma |
| Blockchain | Aptos TypeScript SDK, Move |
| Runtime tooling | npm, TypeScript |

## Repository Structure

```text
.
├── README.md
├── PROJECT_STATUS.md
├── .env.example
├── .gitignore
├── package.json
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   │   ├── event.js
│   │   └── user.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── routes/
│   │   └── user.js
│   ├── scripts/
│   │   └── concurrent-reservation.js
│   └── services/
│       └── auth.js
├── frontend/
│   ├── src/
│   │   ├── Actions/
│   │   ├── Reducers/
│   │   └── components and pages
│   ├── package.json
│   └── vite.config.js
└── nft_code/
    ├── README.md
    ├── Move.toml
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── config/
    │   ├── core/
    │   ├── services/
    │   ├── index.ts
    │   └── main.ts
    └── src/application/sources/event_ticketing.move
```

## Local Setup

### Prerequisites

- Node.js 18 or newer for the main web application
- Node.js 20 or newer for the NFT module and current Aptos SDK
- PostgreSQL
- npm

### Environment configuration

Copy the example environment file and provide local values:

```bash
cp .env.example .env
```

The backend requires at least:

```dotenv
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ticketchain
JWT_SECRET=replace-with-a-local-secret
```

Environment files are excluded from source control by [.gitignore](.gitignore). Never commit production secrets, private keys, or wallet seed phrases.

### Backend

```bash
cd backend
npm install
npx prisma migrate deploy
node server.js
```

The API runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

### NFT module

```bash
cd nft_code
npm install
npm run typecheck
npm run build
npm start
```

The default NFT command is non-mutating. To run the explicit Aptos testnet demonstration:

```bash
npm run demo
```

The demo creates temporary accounts, requests testnet funding, creates a collection, mints tickets, and transfers one ticket. It should only be used for development.

## API Examples

### Register

```bash
curl -X POST http://localhost:5000/api/v1/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Demo User","email":"demo@example.com","password":"Pass123!","walletId":"wallet-demo"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","password":"Pass123!"}'
```

### List events

```bash
curl http://localhost:5000/api/v1/events
```

### Reserve a ticket

```bash
curl -X POST http://localhost:5000/api/v1/event/book_ticket \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <access_token>' \
  -d '{"ticketId":"<ticket_uuid>"}'
```

## Verified Project State

The following workflows have been validated locally:

- Prisma schema validation and migration deployment
- PostgreSQL-backed user registration
- PostgreSQL-backed login
- JWT-protected reservation flow
- Event creation and listing through the Prisma backend
- Event review creation
- Frontend production build with Vite
- NFT module strict typecheck
- NFT module clean TypeScript build
- Safe NFT CLI startup

## Current Boundaries

TicketChain is a strong working foundation, but it is not presented as a finished production deployment. Remaining work includes:

- standardizing all frontend authentication and token handling
- adding automated backend and frontend test suites
- adding health checks, Docker orchestration, and CI workflows
- connecting Aptos ownership events to PostgreSQL inventory reconciliation
- adding production wallet custody and payment provider integrations
- performing a full security and dependency review before deployment

## Presentation Summary

TicketChain demonstrates the design and implementation of a real event-commerce domain rather than a generic starter application. The project combines a working full-stack web application, a relational ticketing model, concurrency-aware reservation logic, secure authentication, and a modular blockchain direction.

Its most valuable technical story is the connection between practical backend correctness and future product capability: the platform protects ticket inventory today while leaving a clear path toward verifiable digital ticket ownership tomorrow.
