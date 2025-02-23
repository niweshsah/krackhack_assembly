# TicketChain 🎟️

**Secure, Transparent, and Fair Ticketing on the Blockchain.**

TicketChain is a blockchain-based event ticketing system that mints tickets as NFTs, ensuring authenticity, preventing fraud, and enabling a fair secondary marketplace with price controls and royalties for organizers.

---

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup and Installation](#setup-and-installation)
4. [Usage](#usage)
5. [Smart Contract Details](#smart-contract-details)
6. [Challenges Faced](#challenges-faced)
7. [Future Improvements](#future-improvements)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features ✨
- **NFT-Based Tickets:** Each ticket is minted as a unique NFT, ensuring authenticity and preventing fraud.
- **Fair Resale Market:** Enforced price controls and automatic royalty distribution to organizers.
- **Transparent Transactions:** All ticket transactions are recorded on the blockchain for full transparency.
- **User-Friendly Interface:** Easy-to-use platform for both crypto-savvy and non-crypto users.
- **Secure Ownership:** Verifiable ticket ownership using blockchain technology.

---

## Tech Stack 🛠️
- **Blockchain:** Aptos (Move language for smart contracts).
- **Frontend:** React.js with TypeScript.
- **Backend:** Node.js (optional for off-chain data).
- **SDK:** Aptos TypeScript SDK for blockchain interactions.
- **Database:** MongoDB (for off-chain data storage).

---

## Setup and Installation 🚀

### Prerequisites
- React.js, Node.js and npm installed.
- Aptos CLI installed.
- Petra Wallet.

### Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/TicketChain.git
   cd TicketChain
   ```
2. Install Dependencies
    ```bash
    cd frontend/
    npm install
    cd ..
    cd backend/
    npm install
    cd ..
    ```
3. Set Up Aptos CLI:
    
  - Install the Aptos CLI:

    ```bash
    curl -fsSL https://aptos.dev/scripts/install_cli.py | python3
    ```
  - Configure the Aptos CLI for the testnet:
    
    ```bash
    aptos init --network testnet
    ```

4. Deploy the Smart Contract:

  - Compile and deploy the Move smart contract:
    
    ```bash
    aptos move compile
    aptos move publish --named-addresses EventTicketing=0x1
    ```

5. Run the Frontend:

    ```bash
    cd frontend/
    npm start
    npm run dev
    cd ..
    cd backend/
    node server.js
    ```
6. Access the Application:

    Open http://localhost:3000 in your browser.

## Usage 🎮
### For Event Organizers
1. Mint Tickets:

    - Connect your wallet.

    - Fill in event details (name, date, seat number, price, royalty percentage).

    - Mint tickets as NFTs.

2. Track Sales and Royalties:

    - View all ticket sales and resales.

    - Receive automatic royalties on every resale.

### For Attendees
1. Buy Tickets:

    - Browse available events.

    - Purchase tickets using your wallet.

2. Resell Tickets:

    - List your ticket on the secondary marketplace.

    - Set a price within the allowed range.

3. Transfer Tickets:

    - Transfer tickets to another wallet securely.

## Smart Contract Details 📜
### Key Functions
1. Mint Ticket:
  
    ```move
    public fun mint_ticket(account: &signer, ticket_id: u64, event_name: String, event_date: String, seat_number: String, price: u64, royalty_percentage: u64): Ticket
    ```
2. Resell Ticket:
  
    ```move
    public fun resell_ticket(account: &signer, ticket: &mut Ticket, new_price: u64)
    ```
3. Royalty Distribution:

    - Automatically calculates and distributes royalties to the organizer on every resale.

## Challenges Faced 🛑

1. Smart Contract Complexity:
    - Fixed royalty distribution logic in the resale function.

2. Frontend-Blockchain Integration:

    - Learned and implemented Aptos TypeScript SDK for wallet integration.

3. Gas Fees and Scalability:

    - Optimized smart contracts to reduce gas usage.

4. User Experience:

    - Added tooltips and guides for non-crypto users.
