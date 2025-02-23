# TicketChain 🎟️

**Secure, Transparent, and Fair Ticketing on the Blockchain.**

TicketChain is a blockchain-based event ticketing system that mints tickets as NFTs, ensuring authenticity, preventing fraud, and enabling a fair secondary marketplace with price controls and royalties for organizers.

[Watch the video](frontend/src/assets/Demonstration%20Video%20TicketChain.mp4)

---

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup and Installation](#setup-and-installation)
4. [Usage](#usage)
5. [NFT Smart Contract Implementation](##nft-smart-contract-implementation)
6. [Smart Contract Details](#smart-contract-details)
7. [Challenges Faced](#challenges-faced)

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
   git clone https://github.com/niweshsah/krackhack_assembly.git
   cd krackhack_assembly/
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

4. Run the Frontend:

    ```bash
    cd frontend/
    npm run dev
    cd ..
    cd backend/
    node server.js
    ```
    
5. Access the Application:

    Open http://localhost:3000 or other in your browser.

## NFT Smart Contract Implementation
The NFT smart contract is implemented in TypeScript using the Aptos SDK. The main contract logic is located in nft_code/src/main_nft.ts, which handles NFT creation and interactions.

### Running the Contract
To execute the contract, follow these steps:

   - Navigate to the nft_code directory:
      ```bash
      cd nft_code
      ```
   - Compile the TypeScript code:
      ```bash
      npx tsc
      ```
   - Run the generated JavaScript file:
      ```bash
      node dist/main_nft.js
      ```
   - Sample Execution Output
      ```bash
      friday_code@JARVIS:~/Music/krackhack_assembly/nft_code$ npx tsc
      friday_code@JARVIS:~/Music/krackhack_assembly/nft_code$ node dist/main_nft.js 
      🎟 Starting NFT Ticketing System
      ================================
      
      1. Creating Accounts
      -------------------
      [Aptos SDK] It is recommended that private keys are AIP-80 compliant (https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-80.md). You can fix the private key by formatting it with `PrivateKey.formatPrivateKey(privateKey: string, type: 'ed25519' | 'secp256k1'): string`.
      [Aptos SDK] It is recommended that private keys are AIP-80 compliant (https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-80.md). You can fix the private key by formatting it with `PrivateKey.formatPrivateKey(privateKey: string, type: 'ed25519' | 'secp256k1'): string`.
      
      Current Balances:
      Organizer Balance: 2.051887 APT
      User 1 Balance: 2.954989 APT
      
      
      2. Creating Ticket Collection
      --------------------------
      🎨 Collection created successfully!
      
      3.a Minting VIP Tickets
      ----------------
      ✅ Starting to mint 2 VIP ticket NFTs...
      Minting ticket 1 of 2...
      Minting ticket 2 of 2...
      🎟 All 2 Ticket NFTs minted successfully!
      
      3.b Minting Normal Tickets
      ----------------
      ✅ Starting to mint 2 NORMAL ticket NFTs...
      Minting ticket 1 of 2...
      Minting ticket 2 of 2...
      🎟 All 2 Ticket NFTs minted successfully!
      
      4. Initial Ticket Sales
      ---------------------
      🛒 0xb5f96a6656d1b7353ea188666db490bdd9091ae7a987a75432e8c742c1995253 is buying a VIP ticket from 0x3e6d013285fe67aec5b7c757498378f31f1b188ff1796488baf0a1e88640edf0 for 0.1 APT
      
       sahu will give payment code
      🎟 VIP ticket successfully transferred to 0xb5f96a6656d1b7353ea188666db490bdd9091ae7a987a75432e8c742c1995253
      
      Balances after initial sales:
      
      Current Balances:
      Organizer Balance: 2.048351 APT
      User 1 Balance: 2.954989 APT
      
      
      Final Balances:
      
      Current Balances:
      Organizer Balance: 2.048351 APT
      User 1 Balance: 2.954989 APT
      ```

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
      
<<<<<<< HEAD

## Our LOOM video link:
[Video Link](https://www.loom.com/share/2374c7c8bc7e4031ae2d32c1a4d41f0a?sid=f680aa31-6168-4ea8-8213-5fcc212cd4dd)
=======
>>>>>>> aa2d933d742eafa8213ac1e0f41ffd1864346da2
