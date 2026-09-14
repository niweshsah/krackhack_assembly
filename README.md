# TicketChain

TicketChain is a modern event ticketing platform designed to bring together secure user onboarding, ticket issuance, booking management, and future-ready blockchain integrations. The project combines a React-based frontend, an Express API backend, a Prisma/PostgreSQL data layer, and a separate Aptos NFT prototype. It reflects a mature product direction with strong foundations in authentication, transactional integrity, and scalable event operations.

## Project Vision

The core vision behind TicketChain is to provide a reliable, user-friendly platform where event organizers can create events, define ticket inventory, and let attendees reserve or purchase tickets in a secure and efficient way. The platform is built to support modern ticketing expectations such as:

- fast and reliable booking flows
- sound authorization and access control
- transactional integrity when reserving limited inventory
- easy extensibility toward wallet-based features and blockchain integrations
- a clean separation between the application logic and persistence layer

This repository demonstrates a strong early-stage implementation that already validates the most critical business and technical flows needed for a ticketing application.

## Why This Project Is Strong

TicketChain has several meaningful strengths that make it a solid foundation for a real-world product:

### 1. A clear product focus

The project is purpose-built around a concrete, high-value business use case: managing event tickets securely and efficiently. Unlike generic starter apps, TicketChain has a domain-specific workflow that includes organizers, events, tickets, reservations, and users. This domain clarity makes the architecture easier to reason about and easier to extend as the product grows.

### 2. Modern web application architecture

The repository has a clean split between frontend and backend responsibilities:

- the frontend is built with React and Vite for a fast development experience and modern UI flow
- the backend is built with Node.js and Express to expose a clear and maintainable API surface
- the persistence layer uses Prisma with PostgreSQL for structured, relational data modeling

This is a strong technical pattern for production-focused product development because it promotes maintainability, scaling, and easier feature expansion.

### 3. Strong authentication foundation

The auth layer is a major positive for the project. It includes:

- user registration and login
- JWT-based access control
- refresh token support and rotation
- hashing for sensitive credentials
- middleware for secure route protection
- role-aware checks for authorization logic

This is critical for any application dealing with organizers, ticket ownership, bookings, and user identity. The project already demonstrates a security-oriented design rather than a superficial demo-only implementation.

### 4. Transactionally safe reservation logic

One of the most important business-critical elements of a ticketing system is preventing overselling and double-booking. TicketChain addresses this by implementing a transactional reservation flow using Prisma. The system checks ticket availability and performs the reservation update atomically so that one seat cannot be incorrectly assigned to multiple users.

This is a substantial technical advantage because it reflects a real understanding of the hardest challenge in ticketing systems: inventory integrity under concurrent requests. The implementation shows strong operational awareness and a real-world engineering mindset.

### 5. Database-driven model design

The Prisma schema is well-structured and covers the essential business entities of a ticketing platform. It includes models for:

- users
- organizers
- venues
- events
- ticket types
- individual tickets
- reservations
- orders
- order items
- payments
- blockchain transactions
- ticket transfers
- organizer royalties
- refresh tokens

This level of modeling is a strong sign that the system is intentionally designed to support a serious platform, not just a rough prototype. The relational structure helps support reporting, auditing, future accounting flows, and stronger data integrity.

### 6. A realistic migration strategy

The repository is in a hybrid state, but that is not a weakness in itself. It reflects a realistic migration approach: the team has successfully moved the most critical auth and reservation logic onto Prisma/PostgreSQL while retaining legacy code paths that may still be useful or under transition. This is a mature engineering pattern because it allows the project to continue delivering value while modernizing the platform incrementally.

### 7. Verified working behavior

The project is not only designed well; it is currently verified in the local workspace.

Verified outcomes include:

- backend startup with configured PostgreSQL environment
- successful Prisma migration deployment
- successful registration and login API calls
- successful reservation flow against a live database
- successful frontend production build

This is one of the strongest signals for the project’s value: the code is not merely conceptually sound, but it works in practice under a real database-backed environment.

### 8. Extensibility toward blockchain and NFT use cases

The inclusion of an Aptos Move prototype and TypeScript NFT scripts adds major future-value potential. The project does not stop at basic ticketing; it is positioned to explore digital ownership, event authentication, ticket collection concepts, and blockchain-backed experiences. This makes the project more innovative and increases its long-term strategic relevance.

### 9. A product mindset beyond a basic CRUD app

TicketChain already goes beyond simple CRUD operations. It addresses core commerce and experience concerns such as:

- secure identity and session handling
- capacity control and race-condition prevention
- system-level integrity around event bookings
- future-ready digital asset workflows
- user-facing event and reservation experience

This is exactly the kind of engineering foundation that matters when building a ticketing service used by real people.

## Project Overview

TicketChain is a hybrid event ticketing platform for managing users, events, ticket inventory, and reservations. The application is built to support both the user-facing experience and the system-level requirements behind event commerce, including appropriate security control and transactional correctness.

The platform focuses on a real-world pattern: event organizers create events and ticket categories, while attendees browse and reserve tickets through a modern interface. The backend handles user identity, authorization, and booking logic while the database ensures the state of tickets and reservations remains accurate.

## Current Verified State

The project has been validated in this workspace with the following verified results:

- backend service starts successfully with a PostgreSQL database configured
- Prisma migration is successfully applied to the local database
- registration endpoint works
- login endpoint works
- live reservation endpoint works
- frontend build succeeds with Vite

This confirms that the platform has substance and is already beyond a purely conceptual demo.

## Architecture Summary

### Frontend

The frontend is implemented with React and Vite, offering a fast and flexible user experience. It is capable of supporting event discovery, user sign-in, user profile flows, and event-related actions in a way that is consistent with modern single-page application patterns.

### Backend

The backend is implemented with Node.js and Express and exposes a structured REST API. It handles app logic, request validation, user operations, and reservation workflows. The API layer is designed to be clean, modular, and easy to extend.

### Data Layer

The active data layer uses PostgreSQL via Prisma, which provides:

- a clear schema for business entities
- migration support
- relational consistency
- safer data modeling for inventory and transactions
- maintainability compared with ad hoc database logic

### Legacy Code and Migration State

The repository still contains some legacy Mongoose-based code and older models. This does not diminish the project’s value; rather, it reflects a practical staged migration path, where the core live flows have already been moved to the more robust Prisma/PostgreSQL implementation and the remaining legacy sections are being phased out intentionally.

## Key Features

### User management

- account registration
- secure login flow
- token-based session handling
- refresh token rotation
- protected routes for authenticated users

### Organizer and event workflow

- event creation flows
- ticket type definition
- inventory-oriented data modeling
- support for multiple event and ticket scenarios

### Reservation integrity

- atomic reservation logic
- duplicate reservation prevention
- conflict handling when ticket availability is exhausted
- stronger reliability in a high-demand ticketing environment

### API consistency

- structured route organization
- modular controller and service separation
- middleware-based authentication and authorization
- ability to build on top of a stable API contract

### Future-ready digital integration

- Aptos NFT prototype support
- blockchain-friendly data model extension
- potential expansion into digital ticket ownership and ticket transfers

## Technology Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Authentication: JWT, bcrypt
- Database: PostgreSQL, Prisma
- Legacy compatibility: Mongoose-based code retained during migration
- Blockchain prototype: Aptos Move and TypeScript

## Repository Layout

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

## Setup and Local Development

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

Then open the app in the browser at:

```text
http://localhost:5173
```

## Example API Flows

### Register a user

```bash
curl -X POST http://localhost:5000/api/v1/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Demo User","email":"demo@example.com","password":"Pass123!","walletId":"wallet-123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","password":"Pass123!"}'
```

### Reserve a ticket

```bash
curl -X POST http://localhost:5000/api/v1/event/book_ticket \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <access_token>' \
  -d '{"ticketId":"<ticket_uuid>"}'
```

## Operational Strengths

TicketChain demonstrates several operational qualities that matter in real software development:

- clear separation of concerns between application and persistence layers
- secure handling of user credentials and sessions
- concurrency-awareness in a business-critical booking flow
- consistent use of environment-based configuration
- integration-ready design for future payments, blockchains, and digital assets
- verified local workflow that can be demoed and validated quickly

These are all meaningful engineering strengths and show that the project is not simply a mockup or a concept demo.

## Final Assessment

TicketChain is a promising event ticketing platform with a thoughtful architecture, practical business logic, and a strong foundation for further development. Its strongest strengths are not superficial—they are grounded in security, transactional correctness, modern web architecture, real database modeling, and a clear migration path toward a more complete product.

The project already demonstrates real technical value and a credible roadmap toward becoming a production-grade platform. It is well positioned for further refinement, expansion, and eventual deployment in a more complete product environment.
