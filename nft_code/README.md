# TicketChain NFT Module

This folder contains the Aptos blockchain module for TicketChain. It provides a focused TypeScript implementation for creating event collections, minting ticket assets, transferring tickets, and processing ticket payments and resale royalties.

The module is intentionally isolated from the React and Express application. It can be developed, compiled, and evaluated independently before being connected to the main ticketing workflow.

## Architecture

```text
nft_code/
├── src/
│   ├── config/
│   │   └── ticketing.ts       Network and ticket policy
│   ├── core/
│   │   ├── AptosClient.ts     SDK client and transaction retries
│   │   └── errors.ts          Domain-specific errors
│   ├── services/
│   │   ├── AccountService.ts  Account creation, funding, and balances
│   │   ├── CollectionService.ts
│   │   │                       Collection creation and ticket minting
│   │   └── TicketService.ts   Ticket discovery, purchase, transfer, resale
│   ├── index.ts               Public module exports
│   └── main.ts                Safe CLI entrypoint and optional demo
├── application/               Move package for future on-chain logic
├── images/                    NFT-related assets
├── Move.toml
├── package.json
└── tsconfig.json
```

## Requirements

- Node.js 20 or newer
- npm
- An Aptos testnet account with funds when running the demo

The Aptos SDK currently declares Node.js 20 as its supported runtime baseline.

## Install and Build

```bash
npm install
npm run build
```

The build emits only the compiled modular implementation into `dist/`.

## Commands

The default entrypoint is safe and does not submit transactions:

```bash
npm start
```

To run the end-to-end testnet flow, use the explicit demo command:

```bash
npm run demo
```

The demo generates two temporary accounts, funds them through the Aptos faucet, creates a collection, mints two VIP tickets, and transfers one ticket to the buyer. It is intended for development only and may consume testnet resources.

For development without compiling first:

```bash
npm run dev
```

## Service Responsibilities

`AptosClient` owns network configuration, transaction submission, confirmation polling, and retry behavior.

`AccountService` manages generated accounts, testnet funding, and balance queries.

`CollectionService` creates digital-asset collections and mints ticket assets with consistent metadata.

`TicketService` handles ticket discovery, payment transactions, asset transfers, and resale royalty payments. Ticket categories and pricing rules are centralized in `config/ticketing.ts`.

## Security Notes

- Never commit private keys or seed phrases.
- Use generated or externally managed accounts for local development.
- Keep production signing outside the frontend and outside source-controlled configuration.
- Review collection metadata URIs before minting production assets.
- Treat the demo as a testnet workflow, not a production deployment.

## Scope

This is a blockchain integration module and prototype. It does not yet synchronize on-chain ownership with the main PostgreSQL ticket inventory or Express API. That integration should be introduced through an explicit service boundary and transaction reconciliation process rather than direct frontend wallet calls.
