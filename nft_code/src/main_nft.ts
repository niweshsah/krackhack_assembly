import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519Account,
  InputViewFunctionData,
  Network,
  TransactionResponse,
  AccountAddress,
  Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";

// import {  } from "aptos";


// =============== Constants ===============
const CONFIG = {
  INITIAL_BALANCE: 100_000_000, // 1 APT
  TICKET_PRICES: {
      VIP: 10_000_000,    // 0.10 APT for VIP tickets
      NORMAL: 5_000_000,  // 0.05 APT for normal tickets
  },
  MAX_RESALE_PRICES: {
      VIP: 15_000_000,    // 0.15 APT max resale for VIP
      NORMAL: 8_000_000,  // 0.08 APT max resale for normal
  },
  ROYALTY_PERCENTAGE: 10, // 10%
  NETWORK: Network.TESTNET,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  MINT_DELAY: 1000, // 1 second between mints
} as const;

// =============== Types & Interfaces ===============
interface AccountInfo {
  name: string;
  account: Ed25519Account;
}

interface BuyTicketParams {
  buyer: Ed25519Account;
  seller: Ed25519Account;
  ticketType: string;
}

interface ResellTicketParams {
  seller: Ed25519Account;
  buyer: Ed25519Account;
  resalePrice: number;
  organizer: Ed25519Account;
  ticketType: string;
}

interface CollectionInfo {
  name: string;
  uri: string;
  description: string;
}

// =============== Custom Error Classes ===============
class TicketingError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
      super(message);
      this.name = "TicketingError";
  }
}

class InsufficientFundsError extends TicketingError {
  constructor(message: string = "Insufficient funds for transaction") {
      super(message);
      this.name = "InsufficientFundsError";
  }
}

class NoTicketsAvailableError extends TicketingError {
  constructor(message: string = "No tickets available") {
      super(message);
      this.name = "NoTicketsAvailableError";
  }
}

class TransactionError extends TicketingError {
  constructor(message: string, cause?: unknown) {
      super(message, cause);
      this.name = "TransactionError";
  }
}

// =============== Main Ticketing System Class ===============
class TicketingSystem {
  private readonly aptos: Aptos;
  private readonly config: AptosConfig;

  constructor() {
      this.config = new AptosConfig({ network: CONFIG.NETWORK });
      this.aptos = new Aptos(this.config);
  }

  // =============== Private Helper Methods ===============
  private async waitWithRetry(hash: string): Promise<void> {
      for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
          try {
              await this.aptos.waitForTransaction({ transactionHash: hash });
              return;
          } catch (error) {
              if (attempt === CONFIG.MAX_RETRIES) {
                  throw new TransactionError("Transaction confirmation failed", error);
              }
              await new Promise((resolve) => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
          }
      }
  }

  private async submitTransactionWithRetry(
      signer: Ed25519Account,
      transaction: any
  ): Promise<string> {
      let lastError;

      for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
          try {
              const committedTxn = await this.aptos.signAndSubmitTransaction({
                  signer,
                  transaction,
              });

              await this.waitWithRetry(committedTxn.hash);
              return committedTxn.hash;
          } catch (error: any) {
              lastError = error;

              if (error?.data?.error_code === "invalid_transaction_update") {
                  await new Promise((resolve) =>
                      setTimeout(resolve, CONFIG.RETRY_DELAY * attempt)
                  );
                  continue;
              }

              throw new TransactionError("Transaction submission failed", error);
          }
      }

      throw new TransactionError("Max retry attempts reached", lastError);
  }


  // =============== Public Methods ===============
  async printBalances(accounts: AccountInfo[]): Promise<void> {
      try {
          console.log("\nCurrent Balances:");
          for (const { name, account } of accounts) {
              const balance = await this.aptos.getAccountAPTAmount({
                  accountAddress: account.accountAddress,
              });
              console.log(`${name} Balance: ${balance / 100_000_000} APT`);
          }
          console.log();
      } catch (error) {
          throw new TicketingError("Failed to fetch account balances", error);
      }
  }

  async mintTicketNFT(
      creator: Ed25519Account,
      collectionName: string,
      ticketName: string,
      ticketURI: string,
      totalTickets: number,
      ticketType: string
  ): Promise<void> {
      try {
          console.log(`✅ Starting to mint ${totalTickets} ${ticketType} ticket NFTs...`);

          for (let i = 0; i < totalTickets; i++) {
              console.log(`Minting ticket ${i + 1} of ${totalTickets}...`);

              const mintTicketTxn = await this.aptos.mintDigitalAssetTransaction({
                  creator,
                  collection: collectionName,
                  description: ticketType,
                  name: `${ticketName} #${i + 1}`,
                  uri: ticketURI,
              });

              await this.submitTransactionWithRetry(creator, mintTicketTxn);

              if (i < totalTickets - 1) {
                  await new Promise((resolve) => setTimeout(resolve, CONFIG.MINT_DELAY));
              }
          }

          console.log(`🎟 All ${totalTickets} Ticket NFTs minted successfully!`);
      } catch (error) {
          throw new TicketingError("Failed to mint ticket NFTs", error);
      }
  }


  async viewAccountTokens(accountAddress: string, ticketType: string): Promise<any> {
      try {
          const tokens = await this.aptos.getAccountOwnedTokens({ accountAddress });

          if (tokens.length > 0) {
              const firstMatchingToken = tokens.find(
                  (token) => token.current_token_data?.description === ticketType
              );

              if (firstMatchingToken) {
                  console.log(`\n🎟 First '${ticketType}' ticket found:`, firstMatchingToken);
                  return firstMatchingToken;
              }

              console.log(`No '${ticketType}' tickets found for this account.`);
              return null;
          }

          console.log("No tokens found for this account.");
          return null;
      } catch (error) {
          throw new TicketingError("Failed to fetch account tokens", error);
      }
  }

  async buyTicket({ buyer, seller, ticketType }: BuyTicketParams): Promise<void> {
      try {
          const price = CONFIG.TICKET_PRICES[ticketType as keyof typeof CONFIG.TICKET_PRICES];
          if (!price) {
              throw new TicketingError(`Invalid ticket type: ${ticketType}`);
          }

          console.log(
              `🛒 ${buyer.accountAddress} is buying a ${ticketType} ticket from ${seller.accountAddress
              } for ${price / 100_000_000} APT`
          );

          const buyerBalance = await this.aptos.getAccountAPTAmount({
              accountAddress: buyer.accountAddress,
          });

          if (buyerBalance < price) {
              throw new InsufficientFundsError();
          }

          const sellerTickets = await this.aptos.getOwnedDigitalAssets({
              ownerAddress: seller.accountAddress,
          });

          if (!sellerTickets.length) {
              throw new NoTicketsAvailableError();
          }

          const firstMatchingToken = sellerTickets.find(
              (token) => token.current_token_data?.description === ticketType
          );

          if (!firstMatchingToken) {
              throw new NoTicketsAvailableError(`No ${ticketType} tickets available`);
          }

          const tokenDataId = firstMatchingToken.token_data_id;

          // Execute payment transaction
        //   const paymentTxn = await this.aptos.transaction.build.simple({
        //       sender: buyer.accountAddress,
        //       data: {
        //           function: "0x1::aptos_account::transfer",
        //           functionArguments: [seller.accountAddress, price],
        //       },
        //   });

        //   await this.submitTransactionWithRetry(buyer, paymentTxn);

        console.log('\n sahu will give payment code');

          // Transfer ticket
          const transferTicketTxn = await this.aptos.transferDigitalAssetTransaction({
              sender: seller,
              digitalAssetAddress: tokenDataId,
              recipient: buyer.accountAddress,
          });

          await this.submitTransactionWithRetry(seller, transferTicketTxn);

          console.log(
              `🎟 ${ticketType} ticket successfully transferred to ${buyer.accountAddress}`
          );


      } catch (error) {
          if (error instanceof TicketingError) {
              throw error;
          }
          throw new TicketingError("Failed to complete ticket purchase", error);
      }
  }

  async resellTicket({
      seller,
      buyer,
      resalePrice,
      organizer,
      ticketType,
  }: ResellTicketParams): Promise<void> {
      try {
          const maxResalePrice = CONFIG.MAX_RESALE_PRICES[ticketType as keyof typeof CONFIG.MAX_RESALE_PRICES];
          if (!maxResalePrice) {
              throw new TicketingError(`Invalid ticket type: ${ticketType}`);
          }

          if (resalePrice > maxResalePrice) {
              throw new TicketingError(
                  `Resale price exceeds maximum allowed for ${ticketType}: ${maxResalePrice / 100_000_000} APT`
              );
          }

          const royaltyAmount = Math.floor(
              (resalePrice * CONFIG.ROYALTY_PERCENTAGE) / 100
          );
          const sellerAmount = resalePrice - royaltyAmount;

          console.log('\n seller address type:',typeof seller.accountAddress);

          console.log(
              `🔄 ${seller.accountAddress} is reselling a ${ticketType} ticket to ${buyer.accountAddress
              } for ${resalePrice / 100_000_000} APT with ${CONFIG.ROYALTY_PERCENTAGE
              }% royalty`
          );

          // Execute main sale
          await this.buyTicket({
              buyer,
              seller,
              ticketType,
          });

          // Pay royalty
          const royaltyTxn = await this.aptos.transaction.build.simple({
              sender: buyer.accountAddress,
              data: {
                  function: "0x1::aptos_account::transfer",
                  functionArguments: [organizer.accountAddress, royaltyAmount],
              },
          });

          await this.submitTransactionWithRetry(buyer, royaltyTxn);
          console.log(
              `✅ Royalty of ${royaltyAmount / 100_000_000} APT paid to Organizer`
          );
      } catch (error) {
          throw new TicketingError("Failed to complete ticket resale", error);
      }
  }

  async createCollection(
      creator: Ed25519Account,
      collectionInfo: CollectionInfo
  ): Promise<void> {
      try {


          const createCollectionTxn = await this.aptos.createCollectionTransaction({
              creator,
              description: collectionInfo.description,
              name: collectionInfo.name,
              uri: collectionInfo.uri,
          });



          await this.submitTransactionWithRetry(creator, createCollectionTxn);
          console.log("🎨 Collection created successfully!");
      } catch (error) {
          throw new TicketingError("Failed to create collection", error);
      }
  }

  async initializeAccounts(
      organizer: Ed25519Account,
      users: Ed25519Account[]
  ): Promise<void> {
      try {
          console.log("🏦 Initializing accounts with initial balance...");

        //   await this.aptos.fundAccount({
        //       accountAddress: organizer.accountAddress,
        //       amount: CONFIG.INITIAL_BALANCE,
        //   });

          for (const user of users) {
              await this.aptos.fundAccount({
                  accountAddress: user.accountAddress,
                  amount: CONFIG.INITIAL_BALANCE,
              });
          }

          console.log("✅ All accounts initialized successfully");
      } catch (error) {
          throw new TicketingError("Failed to initialize accounts", error);
      }
  }
}

// =============== Main Function ===============
async function main() {
  try {
      console.log("🎟 Starting NFT Ticketing System");
      console.log("================================");

      const ticketing = new TicketingSystem();

      // Initialize accounts
      console.log("\n1. Creating Accounts");
      console.log("-------------------");

      
    //   const organizer = Account.generate();
    //   const users = [Account.generate(), Account.generate()];

    //   const backendPrivateKey = new Ed25519PrivateKey("0x7d90b6baf67a4f6e8a9194df96ca1115ce8dfae22b1e980d81e01ac798c2056d");
    //     const organizer = Account.fromPrivateKey({ privateKey: backendPrivateKey });


        const backendPrivateKey = new Ed25519PrivateKey("0x7d90b6baf67a4f6e8a9194df96ca1115ce8dfae22b1e980d81e01ac798c2056d");
        const organizer = Account.fromPrivateKey({ privateKey: backendPrivateKey });

        const user1key = new Ed25519PrivateKey("0x0d2942f0a8ab3d057e426b0f8bdcb3a639d359f91a56a1ee761c4169db06351e");
        // gaurav secret key
        const user1 = Account.fromPrivateKey({ privateKey: user1key });


        const users = [user1];

    //   await ticketing.initializeAccounts(organizer, users);

      // Print initial balances
      const accounts: AccountInfo[] = [
          { name: "Organizer", account: organizer },
          ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
      ];
      
      await ticketing.printBalances(accounts);

      console.log('\n Organiser Account Address:', organizer.accountAddress);

    //   console.log('\n account type: ', typeof organizer);

      console.log('\n organiser:', organizer);
      

      // Create collection
      console.log("\n2. Creating Ticket Collection");
      console.log("--------------------------");
      const collectionInfo: CollectionInfo = {
          name: "Concert Tickets10",
          uri: "https://example.com/tickets",
          description: "Exclusive event tickets.",
      };

      await ticketing.createCollection(organizer, collectionInfo);

      // Mint VIP tickets
      console.log("\n3.a Minting VIP Tickets");
      console.log("----------------");
      await ticketing.mintTicketNFT(
          organizer,
          collectionInfo.name,
          "tickets for event",
          "https://example.com/vip-ticket",
          2,
          "VIP"
      );

      // Mint normal tickets
      console.log("\n3.b Minting Normal Tickets");
      console.log("----------------");
      await ticketing.mintTicketNFT(
          organizer,
          collectionInfo.name,
          "tickets for event",
          "https://example.com/normal-ticket",
          2,
          "NORMAL"
      );

      // Initial ticket sales
      console.log("\n4. Initial Ticket Sales");
      console.log("---------------------");
      await ticketing.buyTicket({
          buyer: users[0],
          seller: organizer,
          ticketType: "VIP",
      });

    //   await ticketing.buyTicket({
    //       buyer: users[1],
    //       seller: organizer,
    //       ticketType: "NORMAL",
    //   });

      console.log("\nBalances after initial sales:");
      await ticketing.printBalances(accounts);

      // Resell ticket
    //   console.log("\n5. Ticket Resale");
    //   console.log("---------------");
    //   await ticketing.resellTicket({
    //       seller: users[0],
    //       buyer: users[1],
    //       resalePrice: 13_000_000, // Increased to be within VIP max resale price
    //       organizer,
    //       ticketType: "VIP",
    //   });

      console.log("\nFinal Balances:");
      await ticketing.printBalances(accounts);
  } catch (error) {
      if (error instanceof TicketingError) {
          console.error("\n❌ Ticketing system error:", error.message);
          if (error.cause) {
              console.error("Caused by:", error.cause);
          }
      } else {
          console.error("\n❌ Unexpected error:", error);
      }
      process.exit(1);
  }
}

// Run the system
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});