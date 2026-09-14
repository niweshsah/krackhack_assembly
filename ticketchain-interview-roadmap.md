# TicketChain → Interview-Grade System Design Roadmap

## 0. What's actually in the repo (ground truth)

I cloned and read the code, not just the README. Here's what's really there, because your interview story has to match this exactly:

**Stack that actually exists:**
- Backend: Node.js + Express, **MongoDB (Mongoose)** — not Postgres/MySQL. `config/database.js` connects to a MongoDB Atlas cluster.
- Frontend: React + Redux (`Actions/`, `Reducers/`), plain `axios` calls to `http://localhost:5000`.
- Blockchain: An Aptos Move module (`nft_code/src/application/sources/event_ticketing.move`) plus ~20 standalone TypeScript scripts (`main_nft.ts`, `test1.ts`...`test17.ts`) that mint/transfer NFTs using the Aptos SDK.

**The most important architectural fact, which you should say explicitly in interviews:**
The Express backend and the Aptos/NFT code are **two completely disconnected systems**. `book_ticket` in `controllers/event.js` never calls any blockchain code — it just decrements a MongoDB field. The NFT minting only happens when you manually run `node dist/main_nft.js` from the CLI, as a demo script, with hardcoded test accounts. There is no listener, no webhook, no shared trigger between "user pays for a ticket in the app" and "an NFT gets minted." This is normal and fine for a hackathon (you had ~24-36 hours), but you should not describe it in an interview as "the backend mints an NFT on purchase" — say "I built both halves separately and the roadmap below is about wiring them together properly."

**Concrete bugs/gaps worth knowing about, because an interviewer who clones the repo will find them:**
- `book_ticket` reads the event, decrements `seats_available` in application memory, then calls `.save()` — classic **read-modify-write race condition**. Two simultaneous requests can both read `seats_available = 1`, both decrement, both save → oversold ticket. There is no `findOneAndUpdate` with an atomic filter, no transaction, no optimistic lock.
- `resale()` in `controllers/event.js` is a stub — it fetches the event and user but doesn't actually transfer anything. Secondary market / royalty logic exists only in the Move contract's `transfer_ticket`, not in the app.
- Auth is broken in a couple of ways: the JWT secret is hardcoded (`'mananmananmanan'`), tokens never expire, and `middlewares/auth.js` reads the token from `req.body.image.token` (looks like a leftover bug from a template), which means the auth middleware as written won't work for a normal JSON request.
- **Secrets are committed to the public repo**: a full MongoDB Atlas connection string with username/password in `config/database.js`, and a Cloudinary API key + secret in two controller files. This is a real, live issue, independent of anything else in this document — rotate those credentials and scrub them from git history before you link this repo in a resume, because bots do scan public GitHub repos for exactly this pattern.
- `routes/event.js` is dead code — `app.js` only mounts `routes/user.js`, which duplicates the event routes itself.
- The frontend has orphaned files unrelated to ticketing (`Microphone.jsx`, `Model.jsx`, a `.glb` 3D model) — looks like leftover boilerplate from a starter template. Worth deleting before you show this to anyone.
- No payments, no Redis, no queue, no search, no tests, no CI, no Docker, no rate limiting.

None of this is a criticism of the hackathon output — 24-36 hour hackathon projects are supposed to look like this. The point of listing it is that your interview narrative should be **"here is the honest starting point, here is what I identified as wrong, here is what I fixed, here is what I'd do at scale"** — that arc is far more impressive than pretending the hackathon version was already solid.

One naming note: the README calls the DB layer generic ("Database: MongoDB") but your prompt described PostgreSQL/MySQL throughout. I'm designing the production schema in **PostgreSQL** below because relational integrity (foreign keys, transactions, unique constraints on seat inventory) is precisely what this domain needs and what Mongo makes awkward. Migrating off Mongo is itself a legitimate, discussable decision — see the interview section.

---

## 1. What you can ACTUALLY implement yourself

Ordered roughly by how much interview leverage each gives you per hour spent.

| # | Improvement | Difficulty | Effort | Worth it? | Tech | What it fixes in your repo |
|---|---|---|---|---|---|---|
| 1 | Fix the race condition with atomic inventory updates | Medium | 1–2 days | **Yes — highest leverage single item** | Postgres `UPDATE ... WHERE seats_available > 0 RETURNING`, or Mongo `findOneAndUpdate` with `$inc` + condition | `book_ticket`'s read-modify-write bug |
| 2 | Migrate MongoDB → PostgreSQL with a real relational schema | Medium-High | 3–5 days | Yes | Postgres, Prisma/Sequelize/Knex | Replaces the entire `models/` layer; enables transactions, FKs, constraints |
| 3 | Real JWT auth with roles (organizer vs attendee) | Low-Medium | 1 day | Yes | jsonwebtoken (env-based secret), bcrypt, refresh tokens | Fixes hardcoded secret + broken middleware |
| 4 | Redis-backed seat reservation with TTL | Medium | 2–3 days | **Yes — the interview centerpiece** | Redis `SETNX`/Lua script, `EXPIRE` | Nothing exists today; this is the "how do you prevent overselling" answer |
| 5 | Idempotency keys on purchase/payment endpoints | Low | half day | Yes | `Idempotency-Key` header, unique constraint in `orders` table | Nothing exists; prevents duplicate charges on retry |
| 6 | Payment integration (test mode) | Medium | 2–3 days | Yes | Stripe test mode (or Razorpay if you want India-relevant) | No payment flow exists at all |
| 7 | Wire the backend to actually call the Move contract on purchase | Medium-High | 3–5 days | Yes — this is your differentiator | Aptos TS SDK, a minting worker/service | Connects the two disconnected halves of the repo |
| 8 | Async processing with a job queue for minting | Medium | 2 days | Yes | BullMQ (Redis-backed) or RabbitMQ | Currently minting is a manual CLI script; this makes it event-driven |
| 9 | Blockchain event listener / confirmation polling | Medium-High | 2–3 days | Yes | Aptos SDK polling or webhook via an indexer | Nothing today confirms a mint succeeded |
| 10 | Ticket ownership verification endpoint | Low-Medium | 1 day | Yes | Query Aptos node for token ownership, cross-check DB | Needed to make "NFT ticket" meaningful (e.g., QR scan at the door) |
| 11 | Basic rate limiting | Low | half day | Yes, cheap win | `express-rate-limit` + Redis store | Nothing exists |
| 12 | Structured logging | Low | half day | Yes, cheap win | `pino` or `winston` + request IDs | Currently just `console.log` |
| 13 | Dockerize backend + Postgres + Redis | Low-Medium | 1 day | Yes | Docker Compose | No containerization exists |
| 14 | CI pipeline (lint, test, build) | Low | 1 day | Yes, cheap win | GitHub Actions | None exists |
| 15 | Deploy to a free/cheap tier | Low-Medium | 1 day | Yes | Render/Railway (backend), Neon/Supabase (Postgres), Upstash (Redis), Vercel (frontend) | Currently local-only |
| 16 | Event search with filters (date, venue, category) | Low-Medium | 1–2 days | Yes | Postgres `ILIKE` + indexes first; discuss Elasticsearch later | `all_events` currently does a naive Mongo regex scan |
| 17 | WebSocket live seat-count updates | Medium | 2 days | Worth it if time permits | `socket.io` (already a dependency in `app.js`!) | You already import `socket.io` but never use it — low-hanging fruit |
| 18 | Database indexing pass | Low | half day | Yes, cheap and always asked about | Postgres `EXPLAIN ANALYZE`, composite indexes | No indexes exist beyond Mongo's default `_id` |
| 19 | Distributed lock for reservation (single-node Redis lock is enough) | Medium | 1 day | Discuss the theory, implement the simple version | Redis `SET NX PX` | Needed once you have >1 backend instance |
| 20 | Monitoring dashboard (basic) | Low-Medium | 1 day | Nice-to-have | Prometheus + Grafana, or just a `/health` + `/metrics` endpoint | None exists |

**Things from your list I'd explicitly *not* build yourself** (they show up in Tier 3 below): read replicas, CDN, Elasticsearch, full observability stack (tracing), circuit breakers, multi-region anything.

---

## 2. What you should NOT actually implement (explain instead)

For each of these, the interview line is literally: *"I didn't implement this because it would be overengineering for a project at this scale, but in a production system handling [X], I would..."*

- **Multi-region deployment** — "...I would run active-active application servers in 2–3 regions behind a global load balancer like AWS Global Accelerator, with Postgres using a primary in one region and read replicas in others, accepting eventual consistency for read-heavy event browsing while keeping writes (purchases) pinned to the primary region to avoid split-brain inventory."
- **Kubernetes** — "...I would containerize each service and run them on EKS/GKE with horizontal pod autoscaling on CPU/queue-depth, because a single VM or PaaS instance is enough until you're running more than a handful of app instances, which this project never needed."
- **Global load balancing / CDN** — "...static assets (event images, frontend bundle) would sit behind CloudFront/Cloudflare, and API traffic would hit a regional ALB, but for a project with dozens of events I just serve static files directly."
- **Kafka at scale** — "...for something like Ticketmaster's real order volume I'd want Kafka for durable, replayable event streams (order-placed, payment-confirmed, mint-requested) with consumer groups per downstream service, but for my traffic a single Redis-backed queue like BullMQ gives the same at-least-once semantics without the operational overhead of running a Kafka cluster."
- **Database sharding** — "...I'd shard by `event_id` or organizer once a single Postgres primary can't hold write throughput during flash sales, but one well-indexed Postgres instance can handle far more than a hobby project's traffic, so I didn't build sharding logic I can't even load-test properly."
- **Cross-region replication / disaster recovery** — "...I'd rely on managed Postgres with automated cross-region snapshots and a documented RTO/RPO, but I didn't set up a second live region because I have no real user base to justify the cost."
- **Blockchain indexing infrastructure** (e.g., running your own Aptos full node / custom indexer) — "...I'd run or subscribe to an indexer (Aptos has hosted indexer APIs) so the backend doesn't poll the chain directly, but for my scale, targeted polling on the specific token IDs I minted is sufficient and far simpler."
- **Massive-scale event ingestion pipelines** — "...for something ingesting millions of on-chain events I'd want a dedicated stream-processing layer, but my event volume (ticket mints/transfers) is small enough that a polling worker is fine."
- **Full microservices** — see the phased architecture below; the honest answer is "I'd split out the NFT-minting worker as its own service because it has different scaling and failure characteristics than the API, but I would not split events/orders/users into separate services at this size — that's premature and adds network calls for no benefit."
- **Advanced observability (full distributed tracing across services)** — "...I'd use OpenTelemetry with a trace collector like Jaeger/Tempo once there are multiple services calling each other, but with essentially one backend service, structured logs plus basic metrics already tell me what I need."

---

## 3. Phased architecture

**Phase 0 — What exists today (hackathon)**
```
React (axios, hardcoded localhost URL)
    → Express (single process, app.js)
        → MongoDB Atlas (Mongoose)
(separately, unconnected) Aptos TS scripts → Aptos testnet
```
No load balancer, no cache, no queue, no auth secret management, and the two halves don't talk to each other.

**Phase 1 — Scalable monolith (what you should actually build)**
```
React (env-configured API URL)
    → Load Balancer (even just Nginx or a managed one)
        → Express app (stateless, JWT-based auth, can run N copies)
            → PostgreSQL (primary) — events, users, orders, tickets, reservations
            → Redis — reservation TTLs, rate limiting, session/token blacklist, job queue
            → BullMQ worker(s) — consumes "payment confirmed" jobs → calls Aptos SDK → mints NFT → writes tx hash back to Postgres
        → Aptos testnet/mainnet (via RPC)
```
This is still one deployable backend codebase — just organized into modules (routes/services/workers) instead of microservices. This is the version worth actually building and is enough to talk convincingly about 90% of the concepts on your list.

**Phase 2 — High traffic (discuss, partially build)**
```
CDN (static assets, event images)
    → Load Balancer
        → Autoscaled application servers (stateless)
            → Postgres (primary + read replicas for browsing/search)
            → Redis cluster (inventory + cache + locks + queue)
            → Dedicated minting-worker service (separate deploy, own scaling)
            → Search service (Elasticsearch/OpenSearch) fed by CDC from Postgres
            → Aptos RPC provider (managed, e.g. a node provider, not your own node)
```
At this point the **minting worker becomes its own service** — not because "microservices are best practice," but because it has genuinely different failure modes (blockchain RPC timeouts, gas price spikes, retry-with-backoff logic) and different scaling needs (bursty, not steady like read traffic) than the main API. That's the concrete, defensible reason to split it — and it's the only split I'd make at this stage.

**When do full microservices make sense?**
Only when you have multiple teams that need to deploy independently, or components whose scaling/failure profiles diverge so much that coupling them causes outages (e.g., a search reindex job taking down ticket purchases because they share a process). For a ticketing platform, a reasonable eventual split is: **core API** (events/users/orders), **payment service**, **NFT/minting service**, **search service** — four, not forty. Anything more granular than that for this domain is speculative complexity you'd be adding to satisfy a buzzword, not a real constraint — and that's a good thing to say out loud in an interview, because it shows judgment.

---

## 4. The hardest problem: 1M users, 50K tickets, same instant

This is the section interviewers will spend the most time on. Be precise about what you'd implement vs. discuss.

**What actually goes wrong without protection:** concurrent read-modify-write on `seats_available` (exactly the bug in your current `book_ticket`), leading to overselling; a slow purchase flow leaving inventory "soft-locked" forever if a user abandons checkout; thundering-herd traffic taking down the DB.

**The approach I'd actually implement (and should be your main talking point):**
1. **Redis as the inventory source of truth for the hot path.** On event creation, seed Redis with a counter per ticket type: `event:{id}:type:{type}:available = 50000`. Purchases decrement atomically with a Lua script (`DECR` guarded by a check that it doesn't go negative) — Lua scripts run atomically in Redis, avoiding a check-then-act race entirely.
2. **Short-lived reservation, not immediate purchase.** A successful decrement creates a reservation record: `reservation:{user_id}:{ticket_id}` with a **TTL of ~5–10 minutes** (`SET ... EX 600`). The user has that window to complete payment. This is the standard "hold" pattern airlines/ticketing sites use.
3. **Reservation expiry releases inventory automatically.** When the Redis key expires, a listener (Redis keyspace notifications) or a periodic reconciliation job increments the counter back. This solves "user abandons checkout."
4. **Idempotency keys on the payment/purchase endpoint.** Client generates a UUID per checkout attempt; server stores it and returns the same result on retry, so a flaky network retry can't double-charge or double-decrement.
5. **Postgres as the durable record, written asynchronously from the Redis reservation.** Once payment succeeds, a transaction writes the `order` + `ticket` rows and marks the reservation consumed. Postgres is not on the hot decrement path — it's the system of record, not the concurrency gatekeeper.
6. **A queue absorbs the burst.** Instead of every one of 1M requests hitting the app synchronously, requests to "attempt purchase" are queued (or the Redis decrement itself acts as the gate — only 50,000 succeed, the rest get an immediate "sold out" response, which is cheap). Real ticket platforms often add a **virtual waiting room** in front of checkout during flash sales specifically to convert a thundering herd into a smooth, rate-limited trickle.
7. **Basic rate limiting + bot protection** at the edge (IP/user-based, plus a CAPTCHA on the reservation endpoint during known high-demand windows) — this is implementable and worth doing.

**What I would implement in this project (scaled down, honestly):**
- Redis atomic decrement + Lua script — yes, build this, it's the single best interview artifact you can produce.
- Reservation TTL + expiry-driven release — yes, build this.
- Idempotency key on the purchase endpoint — yes, cheap and important.
- Postgres row-level locking (`SELECT ... FOR UPDATE`) as a *secondary* safety net when writing the final order — yes, easy to add and good to explain as defense-in-depth.
- Optimistic locking (version column) — worth implementing as an alternative pattern to discuss trade-offs (optimistic = better throughput when contention is low; Redis atomic counter = better when contention is extreme, like a flash sale). Implement one, deeply understand both.

**What I would only discuss, not build:**
- A literal virtual waiting room with queue position streaming to 1M concurrent clients — real engineering effort (WebSocket fan-out at that scale, its own autoscaling story) that you can't meaningfully test without real traffic.
- Distributed locks across multiple Redis nodes (Redlock) — single-instance Redis lock is enough for a personal project; multi-node consensus locking is a production-scale concern.
- Sharding the reservation store across many Redis nodes by event ID — reasonable at Ticketmaster scale, unnecessary for anything you can demo.
- True backpressure infrastructure (load-shedding at the LB layer based on queue depth) — describe it, don't build a fake version that doesn't actually get exercised.

---

## 5. NFT / blockchain architecture

**On-chain (Aptos, via your Move module):** ticket token identity (unique token ID), current owner address, immutable facts that matter for trust — creator/organizer address, royalty percentage, and a content hash or URI pointer. Basically: *who owns this ticket right now, and what are the resale rules*. This is the minimum that needs blockchain guarantees.

**Off-chain in PostgreSQL:** everything mutable, everything that needs to be queried richly, and everything expensive to write on-chain — event details (title, venue, date, description), ticket type/pricing/inventory, user profiles, order history, payment records, review/comment data, and a **mirror** of on-chain state (token ID ↔ internal ticket ID ↔ current owner address ↔ last-known tx hash) kept in sync by your blockchain listener.

**NFT metadata:** store the JSON metadata (name, description, image URL, event attributes) off-chain — ideally on **IPFS** (pin via a service like Pinata/nft.storage) with only the IPFS CID stored on-chain in the token's URI field. This is the standard pattern (same as most NFT projects) and is honestly a step up from what you have now, since your current setup implies a plain database URL rather than content-addressed storage. Should it be mutable? The *ticket* facts (seat, event date) should be immutable once minted — that's the whole point of proving authenticity. But it's fine (and normal) for supplementary marketing metadata (event banner image, description edits) to live in a mutable database field the frontend also displays, as long as it's clearly *not* part of what's cryptographically committed to the token.

**Minting flow after payment, and the two failure cases you'll be asked about directly:**
1. Payment succeeds → app writes an `order` row with status `paid` inside a DB transaction → publishes a `mint_requested` job to the queue.
2. A worker consumes the job, calls the Move contract's `create_ticket`/mint function, waits for transaction confirmation (poll or event subscription), then updates `orders.status = minted` and writes `token_id`, `tx_hash`.
3. **Payment succeeds but minting fails** (chain congestion, RPC timeout, out of gas): the order stays in a `payment_confirmed_mint_pending` state — the user has *definitely* paid and *definitely* has a right to a ticket, so you don't refund automatically. The worker retries with exponential backoff (a dead-letter queue after N attempts alerts a human). The user can still be let into the event using the DB record even before the mint confirms — the NFT is a receipt/proof layer, not the sole source of truth for entry.
4. **Minting succeeds but the DB update fails** (rare, but the query above cuts both ways): this is why the worker should be idempotent and re-check on-chain state before deciding what to write — on retry, first query the chain for "did I already mint a token for this order," and if yes, just reconcile the DB instead of minting a duplicate. This is exactly the kind of two-write consistency problem that a **saga pattern** (compensating actions instead of a single atomic transaction spanning DB + blockchain, which is impossible) is designed for — say that phrase in the interview, it signals you understand why this is hard.

**Confirmation, ownership verification, and events:** poll the Aptos node for transaction status (simple, fine at low volume) or subscribe to an indexer for mint/transfer events at higher volume. To verify ownership (e.g., ticket scanning at the door), query the chain directly for current owner of the token ID rather than trusting the DB mirror, since the DB could be stale if a transfer happened outside your platform.

**Resale/transfer and royalties:** a resale should call the Move contract's transfer function with the royalty logic built in (your contract already has the shape for this, though `resell_ticket` needs the price-cap and royalty-split you describe in the README actually implemented — right now it's not wired up). The app's job is to listen for `transfer`/`resale` events on-chain and update the DB mirror (new owner, resale price) so ticket validity and current-owner lookups stay fast without hitting the chain every time.

**If a user transfers an NFT outside your platform** (directly wallet-to-wallet, bypassing your resale flow): your DB mirror goes stale until your listener catches the on-chain `TransferEvent` and updates ownership. This is exactly why ownership verification at the door should ultimately trust the chain, not the DB, even though the DB is what you query for speed 99% of the time.

**Preventing invalid/duplicate tickets:** enforce a strict 1:1 mapping — one `order_item` row maps to exactly one on-chain token ID, enforced with a unique constraint in Postgres, and the minting worker checks "has this order already been minted" before calling the contract (idempotency again).

**On honesty about "decentralization":** be direct about this in interviews — say clearly that storing metadata and application state in a centralized Postgres/Mongo instance means a user's ability to *see* or *use* their ticket in your app depends on your servers staying up, even though *ownership* of the NFT itself is verifiable independent of you (they could look it up on an Aptos explorer). The genuinely decentralized part is narrow: ownership and transfer history of the token. Everything else — event discovery, search, checkout UX, even which metadata URI the token points to — is exactly as centralized as a normal web app. That's a completely normal, common architecture (most real "NFT" projects work this way) — the honest framing is "blockchain for the trust-critical slice (ownership/provenance/resale royalty enforcement), traditional infra for everything else," not "the whole system is decentralized."

---

## 6. Database design (PostgreSQL)

```sql
users (
  id UUID PK, email UNIQUE NOT NULL, password_hash, name,
  wallet_address, role ENUM('attendee','organizer','admin') DEFAULT 'attendee',
  created_at, updated_at
)

organizers (
  id UUID PK, user_id UUID FK -> users, payout_wallet_address,
  verified BOOLEAN DEFAULT false
)

venues (
  id UUID PK, name, address, city, capacity, latitude, longitude
)

events (
  id UUID PK, organizer_id UUID FK -> organizers, venue_id UUID FK -> venues,
  title, description, category, artist, image_url,
  starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ, status ENUM('draft','published','finished','cancelled'),
  created_at, updated_at
)
-- index: (status, starts_at), (venue_id), full-text index on title/description/artist for search

ticket_types (
  id UUID PK, event_id UUID FK -> events, name, price_cents INT,
  total_quantity INT, sold_quantity INT DEFAULT 0,
  royalty_percentage NUMERIC(5,2), max_resale_price_cents INT,
  CHECK (sold_quantity <= total_quantity)
)

tickets (                          -- one row per individual seat/ticket, minted or not
  id UUID PK, ticket_type_id UUID FK -> ticket_types,
  status ENUM('available','reserved','sold','minted','used','cancelled'),
  current_owner_id UUID FK -> users NULL,
  token_id VARCHAR NULL UNIQUE,     -- on-chain token identifier once minted
  tx_hash VARCHAR NULL,
  UNIQUE (ticket_type_id, seat_reference)  -- prevents duplicate seat assignment
)

reservations (
  id UUID PK, ticket_id UUID FK -> tickets UNIQUE, user_id UUID FK -> users,
  expires_at TIMESTAMPTZ NOT NULL, status ENUM('active','completed','expired','cancelled')
)
-- index on (expires_at) for the sweep job; UNIQUE on ticket_id prevents two active reservations on the same ticket

orders (
  id UUID PK, user_id UUID FK -> users, idempotency_key VARCHAR UNIQUE NOT NULL,
  status ENUM('pending','payment_confirmed','mint_pending','minted','failed','refunded'),
  total_amount_cents INT, created_at
)

order_items (
  id UUID PK, order_id UUID FK -> orders, ticket_id UUID FK -> tickets UNIQUE
  -- UNIQUE(ticket_id) here is the actual "two users can't buy the same ticket" guarantee
)

payments (
  id UUID PK, order_id UUID FK -> orders, provider, provider_txn_id UNIQUE,
  status ENUM('pending','succeeded','failed','refunded'), amount_cents, created_at
)

blockchain_transactions (
  id UUID PK, ticket_id UUID FK -> tickets, tx_hash UNIQUE, tx_type ENUM('mint','transfer','resale'),
  status ENUM('pending','confirmed','failed'), submitted_at, confirmed_at
)

ticket_transfers (
  id UUID PK, ticket_id UUID FK -> tickets, from_user_id, to_user_id,
  transfer_type ENUM('resale','gift','platform_transfer'), price_cents NULL,
  blockchain_tx_id UUID FK -> blockchain_transactions, created_at
)

organizer_royalties (
  id UUID PK, organizer_id UUID FK -> organizers, ticket_transfer_id UUID FK -> ticket_transfers,
  amount_cents, status ENUM('pending','paid'), paid_at
)
```

**How this prevents double-purchase, concretely:**
1. `UNIQUE (ticket_id)` on `order_items` and `UNIQUE (ticket_id)` on `reservations` mean the database itself rejects a second reservation/order on a ticket already claimed, independent of application logic.
2. The reservation step uses `UPDATE tickets SET status = 'reserved' WHERE id = $1 AND status = 'available'` — an atomic conditional update. If two requests race, only one gets `rowCount = 1`; the loser sees `rowCount = 0` and returns "sold out," never touching the unique constraint at all.
3. `CHECK (sold_quantity <= total_quantity)` on `ticket_types` is a second line of defense at the aggregate level.

**Key indexes:** `events (status, starts_at)` for browsing, `events` full-text index for search, `tickets (ticket_type_id, status)` for fast inventory counts, `reservations (expires_at)` for the expiry sweeper, `orders (idempotency_key)` unique index for the idempotency check, `blockchain_transactions (tx_hash)` unique.

---

## 7. API design

```
POST   /events                          organizer only, JWT required
GET    /events                          public, supports ?city=&category=&date_from=&date_to=&q=
GET    /events/:id                      public
POST   /events/:id/ticket-types         organizer only
POST   /events/:id/tickets/reserve      auth required — atomic reserve, returns reservation_id + expires_at
POST   /orders                          auth required — requires Idempotency-Key header, references reservation_id
POST   /payments                        auth required — requires Idempotency-Key header
GET    /tickets/:id                     auth required (owner or organizer)
POST   /tickets/:id/resell              auth required — enforces max_resale_price, creates a new reservation for buyer
POST   /tickets/:id/transfer            auth required — direct gift/transfer, still recorded on-chain
GET    /tickets/:id/verify              door-scanning use case — checks chain + DB, returns valid/used/invalid
```

**Auth:** JWT access tokens (short-lived, ~15 min) + refresh tokens (stored hashed, revocable), role claims (`attendee`/`organizer`/`admin`) checked via middleware — this directly replaces the current broken `isAuthenticated`.

**Idempotency:** required on `POST /orders` and `POST /payments` via an `Idempotency-Key` header; server stores `(key, response)` and returns the cached response on retry rather than reprocessing — this is what prevents a network retry from double-charging a card or double-minting an NFT.

**Rate limiting:** per-IP and per-user limits on `/reserve` and `/payments` specifically (these are the endpoints a bot would hammer during a flash sale), implemented with a Redis-backed token bucket (`express-rate-limit` + `rate-limit-redis`).

---

## 8. Caching

**Cache in Redis:**
- Event listings/details (`event:{id}` and paginated listing pages) — TTL of a few minutes, since events don't change often once published.
- Ticket inventory counters — the *source of truth* for the hot decrement path, not just a cache (see Section 4).
- Reservation TTLs — inherently a Redis-native concept (`EXPIRE`).
- Sessions/refresh-token blacklist.
- Rate-limit counters.
- Distributed locks (single-instance) for anything that needs "only one worker does this right now" (e.g., the reservation-expiry sweeper).

**Do NOT cache:** payment status (must always read fresh from the DB — caching a payment state risks acting on stale "not yet paid" data), order history (low read volume, high correctness requirement), anything involving money that a stale read could double-spend.

**Invalidation:** write-through on event updates (organizer edits event → update Postgres, then update/delete the Redis key in the same request); TTL-based expiry as the safety net for anything you forget to invalidate explicitly.

---

## 9. Asynchronous architecture

```
Purchase request → [sync] atomic Redis reservation → [sync] payment charge
   → [sync, fast] write order+payment rows, return success to user immediately
   → [async, queue] "mint_requested" job
        → worker calls Aptos SDK → submits tx → polls for confirmation
        → on success: update tickets/orders/blockchain_transactions
        → on failure: retry with backoff, then dead-letter queue + alert
   → [async, queue] "send_confirmation_email" job (fire-and-forget, non-critical)
```

**Why async here specifically:** minting has unpredictable latency (blockchain confirmation isn't instant) and a non-trivial failure rate (RPC timeouts, gas issues) — making the user's checkout wait on it would tank conversion and tie up an app server thread for something outside your control. Payment itself stays **synchronous** because the user is actively waiting for a yes/no on their card, and it's fast/reliable by comparison (managed payment providers have SLAs; public blockchains don't).

**Queue tech:** BullMQ (Redis-backed) is genuinely enough for this project's scale and reuses infrastructure you already need for reservations — no need to stand up Kafka/RabbitMQ for a personal project, but be ready to explain when you'd graduate to Kafka (durable replay across multiple independent consumers, guaranteed ordering per partition, audit-log-style event sourcing — none of which a single minting worker needs).

---

## 10. Search

**Start with Postgres, and mean it:** `ILIKE` plus a `GIN` trigram index, or Postgres full-text search (`tsvector`/`tsquery`) with a `GIN` index, comfortably handles search-by-name/artist/venue/category plus filtering by date range and sorting by date/price for anything up to hundreds of thousands of events. Your current `all_events` regex scan is the thing to fix first — a proper Postgres FTS index is a real, buildable, interview-relevant upgrade.

**When Elasticsearch/OpenSearch becomes justified:** once you need fuzzy/typo-tolerant search across many fields simultaneously with relevance ranking, faceted filtering (category + date + price range + location, combined, fast), or geo-distance queries at high query volume — i.e., when Postgres's query planner starts struggling under combined text+facet+geo load. For this project, describe that threshold rather than standing up an ES cluster you'd never load-test properly.

---

## 11. Observability and reliability

**Implement yourself:** structured JSON logging with request IDs (`pino`), a `/health` endpoint checking DB/Redis connectivity, basic metrics (request count/latency/error rate) exposed for Prometheus scraping, retries with exponential backoff on the minting worker, and a dead-letter queue for jobs that exhaust retries.

**Discuss, don't build:** full distributed tracing (OpenTelemetry + Jaeger) — genuinely useful once requests span multiple services, of limited value with one backend service; a dedicated error-tracking SaaS (Sentry) — cheap to add honestly, so this one's borderline-worth-doing if you have 30 minutes; circuit breakers between services — relevant once you call multiple downstream services (payment provider, blockchain RPC, email provider) and want to fail fast instead of cascading — worth explaining conceptually for the blockchain RPC call specifically, since that's your actual unreliable external dependency.

---

## 12. Cloud deployment

**Realistic and cheap/free as a student:**
```
Vercel/Netlify (frontend, free tier)
    → Render or Railway (backend, free/hobby tier)
        → Neon or Supabase (Postgres, free tier)
        → Upstash (Redis, free tier, serverless-friendly)
        → BullMQ workers as a second Render/Railway service
    → Aptos testnet public RPC (free)
```
This is all genuinely deployable by you, today, for $0–5/month, and gives you a live demo link for interviews — worth doing.

**Describe conceptually rather than build:** AWS/GCP with VPCs, ALB + autoscaling groups, RDS Multi-AZ, ElastiCache clusters, CloudFront — know the shape (CDN → LB → app tier → managed DB/cache → managed queue → worker tier) and be ready to map your Render/Neon/Upstash setup onto the equivalent AWS services one-for-one in conversation, but don't spend money/time standing up real AWS infra for a project with no real users.

---

## 13. Prioritized roadmap

**Tier 1 — Definitely implement**
- Fix the `book_ticket` race condition (atomic update)
- Migrate to PostgreSQL with the schema above
- Real JWT auth with roles
- Redis reservation system with TTL expiry (the centerpiece)
- Idempotency keys on order/payment endpoints
- Payment integration (Stripe test mode)
- Wire the backend to actually call the Move contract on purchase, via a queue worker
- Basic rate limiting, structured logging, a health endpoint
- Docker Compose for local dev, deploy the free-tier stack above
- Rotate/remove the hardcoded secrets currently in the repo — do this regardless of anything else

**Tier 2 — Implement if time permits**
- WebSocket live seat-count updates (you already have `socket.io` imported and unused — cheap win)
- Postgres full-text search with proper indexes
- Blockchain confirmation polling + a `blockchain_transactions` reconciliation job
- CI pipeline (lint/test/build on push)
- Basic Prometheus metrics + a Grafana dashboard

**Tier 3 — Explain only in interviews**
- Multi-region deployment, Kubernetes, global load balancing
- Kafka, database sharding, read replicas at scale
- Elasticsearch/OpenSearch
- Full distributed tracing, circuit breakers
- Running your own blockchain indexer/node
- A literal virtual waiting room for flash-sale traffic

---

## 14. Interview narrative + likely follow-ups

**Opening framing:**
"I built this originally as a hackathon project — a MERN-style app for events and users, plus a separate Aptos Move smart contract for NFT tickets, built in about a day. After the hackathon I went back through it like a production engineer would: I found a real race condition in the ticket-booking logic, hardcoded secrets that needed rotating, and the fact that the web app and the blockchain code never actually talked to each other. I used that as the basis for a redesign — migrating to Postgres, adding a Redis-backed reservation system to solve overselling properly, adding payments, and building the pipeline that connects a successful purchase to an actual on-chain mint. The parts I didn't build — sharding, Kafka, multi-region — I can walk through the design for, but I made a deliberate call not to build them because they'd be solving problems I don't actually have yet."

**Likely follow-ups and how to answer:**

- **"How do you prevent overselling?"** — Atomic conditional update as the first gate (`UPDATE ... WHERE status='available'`), backed by a unique constraint on `order_items.ticket_id` as a hard database-level guarantee, plus a Redis-based reservation counter with TTL for the flash-sale hot path so the database isn't hammered by every one of a million requests.

- **"Why Redis? Why not just Postgres?"** — Postgres row locks work but under extreme contention (50K tickets, 1M simultaneous requests) you get lock contention and connection pool exhaustion; Redis's single-threaded atomic operations (`DECR`, Lua scripts) handle that specific hot-path decrement far faster and cheaper, while Postgres remains the durable system of record for everything that isn't on the millisecond-critical path.

- **"Why Kafka?" / "Why not Kafka?"** — I didn't use it; BullMQ on Redis gives me the queue semantics I actually need (retry, backoff, dead-letter) without running a second piece of distributed infrastructure. Kafka earns its keep when you need durable replay across independent consumer groups or ordered event logs for audit — I'd introduce it if I had multiple independent services that all needed to react to the same "ticket sold" event.

- **"Why microservices?"** — I'd split out exactly one thing: the minting worker, because blockchain calls have a different latency/failure profile than normal API requests and I don't want a stuck RPC call to block ticket-browsing traffic. I would not split events/users/orders into separate services — that adds network hops and deployment complexity without a real, current reason.

- **"Why isn't your system truly decentralized?"** — Ownership and transfer of the ticket NFT is verifiable on-chain independent of my servers, but event metadata, search, and the app experience run through a centralized database — that's a deliberate trade-off: full decentralization of application state would mean giving up fast queries, easy schema evolution, and reasonable UX, none of which the ticketing use case actually needs to be trustless about. The trust-critical part (who owns this ticket, can it be duplicated) is the part I put on-chain.

- **"What happens if payment succeeds but NFT minting fails?"** — The order is marked `payment_confirmed, mint_pending` — the user keeps their entitlement (they paid, they get in), the mint is retried asynchronously with backoff, and if it exhausts retries it goes to a dead-letter queue for manual intervention. I never auto-refund a successful payment just because a downstream step failed; that's the wrong failure mode for the user.

- **"What happens if two users buy the last ticket?"** — The atomic conditional update means only one `UPDATE` affects a row; the second request gets `rowCount = 0` and is told "sold out" before it ever reaches payment. The unique constraint on `order_items.ticket_id` is the second, database-enforced backstop even if application logic somehow raced past the first check.

- **"How would your system handle 1 million concurrent users?"** — Realistically: a rate-limited or waiting-room layer in front of checkout to convert a spike into a manageable trickle, horizontally scaled stateless app servers behind a load balancer, Redis absorbing the inventory hot path, Postgres kept off the hot path and used only for durable writes, and read replicas for the browsing traffic that isn't purchase-related. I'd want to load-test this before claiming a number, and I haven't — I can describe the design, not a benchmark I never ran.

- **"How would you scale the database?"** — Read replicas first (cheap, solves the actual bottleneck for a browsing-heavy ticketing site), then partitioning/sharding by event_id only if a single primary's write throughput genuinely becomes the bottleneck, which for ticket sales usually happens only during specific flash-sale windows, not steady-state.

- **"What happens if Redis goes down?"** — The reservation/inventory hot path degrades — I'd want a Redis Sentinel/cluster setup with replicas for HA in production; failing that, the fallback is a slower, DB-only atomic-update path so purchases still work correctly, just without the extra throughput headroom Redis provides.

- **"What happens if the blockchain is unavailable?"** — Purchases still succeed (payment + DB order creation don't depend on chain availability); minting jobs simply queue up and retry once the RPC is healthy again, which is exactly why minting is asynchronous and decoupled from the purchase flow in the first place.

- **"Why store NFT metadata in a database instead of fully on-chain?"** — Cost and flexibility — writing rich metadata (images, long descriptions) on-chain is expensive and effectively immutable; the standard pattern (which I use) is to store a content hash/URI on-chain (ideally pointing to IPFS) and keep the queryable, mutable presentation layer off-chain.

- **"Why use NFT tickets at all instead of a normal database record?"** — Verifiable ownership independent of the platform (a ticket's authenticity and current owner can be checked by anyone against the chain, not just trusted because my database says so), and programmable resale rules (royalty enforcement on resale is exactly the kind of logic a smart contract can guarantee that a plain database can't stop a user from working around, e.g., an off-platform side deal).

---

*One last honest note: don't claim in an interview that features from Tier 1 are done unless you've actually built them from this repo's current state. The gap between "hackathon MVP" and "this roadmap" is real work — but walking an interviewer through that gap, with specifics about what was actually broken and why, is a stronger signal than a project that looks finished but that you can't defend under questioning.*
