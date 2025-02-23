import { 
    Account, 
    Aptos, 
    AptosConfig, 
    Ed25519Account, 
    Network
  } from "@aptos-labs/ts-sdk";
  
  // Constants
  const CONFIG = {
    INITIAL_BALANCE: 100_000_000, // 1 APT
    TICKET_PRICE: 5_000_000, // 0.05 APT
    MAX_RESALE_PRICE: 8_000_000, // 0.08 APT
    ROYALTY_PERCENTAGE: 10, // 10%
    NETWORK: Network.DEVNET,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second
  } as const;
  
  // Interfaces
  interface AccountInfo {
    name: string;
    account: Ed25519Account;
  }
  
  interface CollectionInfo {
    name: string;
    uri: string;
    description: string;
  }
  
  // Error class
  class TicketingError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
      super(message);
      this.name = "TicketingError";
    }
  }
  
  // Ticketing System Class
  class TicketingSystem {
    fetchUserNFTs(user: Ed25519Account) {
        throw new Error("Method not implemented.");
    }
    private readonly aptos: Aptos;
    private readonly config: AptosConfig;
  
    constructor() {
      this.config = new AptosConfig({ network: CONFIG.NETWORK });
      this.aptos = new Aptos(this.config);
    }

    async initializeAccounts(
          organizer: Ed25519Account,
          users: Ed25519Account[]
        ): Promise<void> {
          try {
            console.log('🏦 Initializing accounts with initial balance...');
            
            await this.aptos.fundAccount({ 
              accountAddress: organizer.accountAddress, 
              amount: CONFIG.INITIAL_BALANCE 
            });
            
            for (const user of users) {
              await this.aptos.fundAccount({ 
                accountAddress: user.accountAddress, 
                amount: CONFIG.INITIAL_BALANCE 
              });
            }
            
            console.log('✅ All accounts initialized successfully');
          } catch (error) {
            throw new TicketingError('Failed to initialize accounts', error);
          }
        }
  
    private async waitWithRetry(hash: string): Promise<void> {
      for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
        try {
          await this.aptos.waitForTransaction({ transactionHash: hash });
          return;
        } catch (error) {
          if (attempt === CONFIG.MAX_RETRIES) throw error;
          await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
        }
      }
    }
  
    private async submitTransactionWithRetry(signer: Ed25519Account, transaction: any): Promise<string> {
      for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
        try {
          const txn = await this.aptos.signAndSubmitTransaction({ signer, transaction });
          await this.waitWithRetry(txn.hash);
          return txn.hash;
        } catch (error) {
          console.error(`Transaction failed (Attempt ${attempt}):`, error);
          if (attempt === CONFIG.MAX_RETRIES) throw new TicketingError("Max retry attempts reached", error);
          await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
        }
      }
      throw new TicketingError("Unexpected error in transaction submission");
    }
  
    async printBalances(accounts: AccountInfo[]): Promise<void> {
      console.log("\n🔍 Fetching account balances...");
      for (const { name, account } of accounts) {
        try {
          const balance = await this.aptos.getAccountAPTAmount({ accountAddress: account.accountAddress });
          console.log(`${name} Balance: ${balance / 100_000_000} APT`);
        } catch (error) {
          console.error(`❌ Failed to fetch balance for ${name}:`, error);
        }
      }
    }
    async mintTicketNFT(
        creator: Ed25519Account,
        collectionName: string,
        ticketName: string,
        ticketURI: string,
        totalTickets: number
      ): Promise<void> {
        console.log(`\n🎟 Minting ${totalTickets} Ticket NFTs...`);
      
        for (let i = 0; i < totalTickets; i++) {
          console.log(`Minting ticket ${i + 1} of ${totalTickets}...`);
      
          try {
            const mintTxn = await this.aptos.mintDigitalAssetTransaction({
              creator,
              collection: collectionName,
              description: "Event Access Ticket",
              name: `${ticketName} #${i + 1}`,
              uri: ticketURI,
            });
      
            await this.submitTransactionWithRetry(creator, mintTxn);
            console.log(`✅ Ticket ${i + 1} minted successfully!`);
            
            if (i < totalTickets - 1) {
              console.log(`⏳ Waiting for 1 seconds before minting the next ticket...`);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
      
          } catch (error) {
            console.error(`❌ Failed to mint Ticket ${i + 1}:`, error);
          }
        }
      }
      
  
    async createCollection(creator: Ed25519Account, collectionInfo: CollectionInfo): Promise<void> {
      console.log("\n🎨 Creating NFT Collection...");
  
      try {
        const txn = await this.aptos.createCollectionTransaction({
          creator,
          name: collectionInfo.name,
          uri: collectionInfo.uri,
          description: collectionInfo.description,
        });
  
        await this.submitTransactionWithRetry(creator, txn);
        console.log(`✅ Collection '${collectionInfo.name}' created successfully!`);
      } catch (error) {
        console.error("❌ Failed to create collection:", error);
      }
    }
  }
  
  // Main f
  async function main() {
  try {
    console.log("\n🎟 Starting NFT Ticketing System\n==============================");

    const ticketing = new TicketingSystem();

    console.log("\n1️⃣ Creating Accounts...");
    const organizer = Account.generate();
    const user = Account.generate();

    const accounts: AccountInfo[] = [
      { name: "Organizer", account: organizer },
      { name: "User", account: user }
    ];

    // ✅ Fund accounts before proceeding
    await ticketing.initializeAccounts(organizer, [user]);

    await ticketing.printBalances(accounts);

    console.log("\n2️⃣ Creating NFT Collection...");
    const collectionInfo: CollectionInfo = {
      name: "Event Tickets",
      uri: "https://example.com/tickets",
      description: "Exclusive access event tickets."
    };

    await ticketing.createCollection(organizer, collectionInfo);

    console.log("\n3️⃣ Minting NFT Tickets...");
    await ticketing.mintTicketNFT(organizer, collectionInfo.name, "VIP Ticket", "https://example.com/vip-ticket", 3);

    console.log("\n4️⃣ Fetching User's NFTs...");
    ticketing.fetchUserNFTs(user);

    console.log("\n✅ NFT Ticketing System Execution Completed!");

  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

  
  // Run the system
  main();