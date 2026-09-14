# Project Status

## Overview

TicketChain is a hybrid event ticketing platform with a React frontend, an Express API backend, a PostgreSQL-backed Prisma data layer, and a separate Aptos NFT prototype. The project is currently in a transitional state: the authentication and ticket reservation flows are now validated against PostgreSQL, while several legacy event and profile paths still reflect the earlier Mongoose-based implementation.

## Current Verified State

The following items have been verified in this workspace:

- The backend starts successfully with a PostgreSQL connection configured.
- Prisma migrations run successfully against a live local PostgreSQL database.
- User registration and login flows work with the database-backed auth layer.
- Ticket reservation logic completes successfully and creates reservation records in the database.
- The frontend builds successfully with Vite.

This means the repository is operational in a hybrid state, but it has not yet been fully standardized onto a single architecture.

## Architecture

### Frontend

- React + Vite
- Client-side state management for app flows
- Local development server typically runs on port 5173

### Backend

- Node.js + Express
- JWT-based authentication
- Prisma ORM with PostgreSQL
- Legacy Mongoose code still exists in older modules and routes

### Data Model

The current PostgreSQL schema includes entities for:

- User
- Organizer
- Venue
- Event
- TicketType
- Ticket
- Reservation
- Order
- OrderItem
- Payment
- BlockchainTransaction
- TicketTransfer
- OrganizerRoyalty
- RefreshToken

### NFT Prototype

The Aptos Move and TypeScript NFT code exists under the nft_code directory. It is currently separate from the live backend and is not yet integrated into the application runtime.

## Repository Structure

```text
.
├── README.md
├── PROJECT_STATUS.md
├── .env
├── .env.example
├── .gitignore
├── package.json
├── requirements.txt
├── ticketchain-interview-roadmap.md
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── config/
│   │   ├── config.env
│   │   ├── database.js
│   │   └── prisma.js
│   ├── controllers/
│   │   ├── user.js
│   │   └── event.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── routes/
│   │   ├── user.js
│   │   └── event.js
│   ├── scripts/
│   │   └── concurrent-reservation.js
│   ├── services/
│   │   └── auth.js
│   └── node_modules/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── nft_code/
│   ├── Move.toml
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
└── backend/node_modules/
```

## Tech Stack

- Frontend: React, Vite, Redux-style state management
- Backend: Node.js, Express, JWT, bcrypt
- Database: PostgreSQL via Prisma
- Legacy code: MongoDB/Mongoose still present in older implementation paths
- Blockchain prototype: Aptos Move + TypeScript scripts

## Current Implementation Highlights

### Authentication

The auth layer is implemented using Prisma-backed user models with:

- registration
- login
- refresh token handling
- access token and refresh token rotation
- bearer authentication middleware
- role-aware authorization checks

### Reservation System

The reservation flow implements a transactional ticket reservation process designed to prevent duplicate booking. The logic includes:

- ticket availability check
- atomic update of ticket status
- reservation creation record
- conflict response when the ticket is already unavailable

### API Behavior

The active backend route set under /api/v1 includes:

- POST /register
- POST /login
- POST /refresh
- GET /logout
- POST /event/book_ticket
- POST /event/create
- GET /events

## Environment Configuration

The project uses a local .env file for environment variables. It is intended to remain local and excluded from source control.

Example values:

```dotenv
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ticketchain
MONGO_URI=mongodb://localhost:27017/ticketchain
JWT_SECRET=dev-local-jwt-secret-change-me
CLOUDINARY_CLOUD_NAME=demo-cloud-name
CLOUDINARY_API_KEY=demo-api-key
CLOUDINARY_API_SECRET=demo-api-secret
```

## How to Run the Project

### Backend

```bash
cd backend
npm install
env DATABASE_URL='postgresql://postgres:postgres@localhost:5432/ticketchain' PORT=5000 node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is typically available at:

```text
http://localhost:5173
```

## Verified Commands and Outcomes

The following commands were validated:

- Prisma migration deployment against the local PostgreSQL instance
- backend registration request
- backend login request
- backend ticket reservation request
- frontend production build via Vite

## Current Risks and Limitations

The repository is not yet fully standardized to a single architecture. The main limitations are:

- legacy Mongoose models remain in the codebase
- some event/profile code paths still reflect the old stack
- frontend API URLs are not yet fully centralized
- NFT minting is not connected to the live backend
- production-ready operational tooling such as Docker Compose, health checks, and deployment automation is not complete

## Recommended Next Steps

1. Remove or formally retire legacy Mongoose routes and models.
2. Standardize frontend API configuration and auth token handling.
3. Consolidate the remaining event flows onto the Prisma/PostgreSQL stack.
4. Add production-grade environment and deployment configuration.
5. Connect the NFT workflow to the backend only after product requirements are finalized.

## Conclusion

TicketChain is in a working transitional state with a verified local backend and a successful frontend build. It is suitable for local development and validation, but it still requires a final architecture cleanup before it can be treated as a completed production-ready project.
