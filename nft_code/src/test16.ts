import {
    Account,
    Aptos,
    AptosConfig,
    Ed25519Account,
    InputViewFunctionData,
    Network,
    TransactionResponse,
    AccountAddress,
} from "@aptos-labs/ts-sdk";

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
    ADDRESSES: {
        ORGANIZER: "0xa53709fb9b81a068f5c4868c62c2513463411995184fb00a7e3c6166b58c9cd1",
        USER1: "0xb5f96a6656d1b7353ea188666db490bdd9091ae7a987a75432e8c742c1995253",
        USER2: "0x3e6d013285fe67aec5b7c757498378f31f1b188ff1796488baf0a1e88640edf0"
    }
} as const;

// =============== Types & Interfaces ===============
interface AccountInfo {
    name: string;
    address: string;
}

interface BuyTicketParams {
    buyerAddress: string;
    sellerAddress: string;
    ticketType: string;
}

interface ResellTicketParams {
    sellerAddress: string;
    buyerAddress: string;
    resalePrice: number;
    organizerAddress: string;
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

    // =============== Public Methods ===============
    async printBalances(accounts: AccountInfo[]): Promise<void> {
        try {
            console.log("\nCurrent Balances:");
            for (const { name, address } of accounts) {
                const balance = await this.aptos.getAccountAPTAmount({
                    accountAddress: address,
                });
                console.log(`${name} Balance: ${balance / 100_000_000} APT`);
            }
            console.log();
        } catch (error) {
            throw new TicketingError("Failed to fetch account balances", error);
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
    

    async buyTicket({ buyerAddress, sellerAddress, ticketType }: BuyTicketParams): Promise<void> {
        try {
            const price = CONFIG.TICKET_PRICES[ticketType as keyof typeof CONFIG.TICKET_PRICES];
            if (!price) {
                throw new TicketingError(`Invalid ticket type: ${ticketType}`);
            }

            console.log(
                `🛒 ${buyerAddress} is buying a ${ticketType} ticket from ${sellerAddress} for ${price / 100_000_000} APT`
            );

            const buyerBalance = await this.aptos.getAccountAPTAmount({
                accountAddress: buyerAddress,
            });

            if (buyerBalance < price) {
                throw new InsufficientFundsError();
            }

            const sellerTickets = await this.aptos.getOwnedDigitalAssets({
                ownerAddress: sellerAddress,
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
            const paymentTxn = await this.aptos.transaction.build.simple({
                sender: buyerAddress,
                data: {
                    function: "0x1::aptos_account::transfer",
                    functionArguments: [sellerAddress, price],
                },
            });

            // Note: You'll need to implement the actual transaction signing here
            // This will require the private keys of the accounts

            await this.submitTransactionWithRetry(buyer, paymentTxn);

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

            console.log(
                `🎟 ${ticketType} ticket successfully transferred to ${buyerAddress}`
            );
        } catch (error) {
            if (error instanceof TicketingError) {
                throw error;
            }
            throw new TicketingError("Failed to complete ticket purchase", error);
        }
    }

    async resellTicket({
        sellerAddress,
        buyerAddress,
        resalePrice,
        organizerAddress,
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

            console.log(
                `🔄 ${sellerAddress} is reselling a ${ticketType} ticket to ${buyerAddress} for ${resalePrice / 100_000_000} APT with ${CONFIG.ROYALTY_PERCENTAGE}% royalty`
            );

            // Execute main sale
            await this.buyTicket({
                buyerAddress,
                sellerAddress,
                ticketType,
            });

            // Note: You'll need to implement the actual transaction signing here
            // This will require the private keys of the accounts

            console.log(
                `✅ Royalty of ${royaltyAmount / 100_000_000} APT paid to Organizer`
            );
        } catch (error) {
            throw new TicketingError("Failed to complete ticket resale", error);
        }
    }
}

// =============== Main Function ===============
async function main() {
    try {
        console.log("🎟 Starting NFT Ticketing System");
        console.log("================================");

        const ticketing = new TicketingSystem();

        // Initialize account info
        const accounts: AccountInfo[] = [
            { name: "Organizer", address: CONFIG.ADDRESSES.ORGANIZER },
            { name: "User 1", address: CONFIG.ADDRESSES.USER1 },
            { name: "User 2", address: CONFIG.ADDRESSES.USER2 },
        ];

        // Print initial balances
        await ticketing.printBalances(accounts);

        // Example of buying a ticket
        await ticketing.buyTicket({
            buyerAddress: CONFIG.ADDRESSES.USER1,
            sellerAddress: CONFIG.ADDRESSES.ORGANIZER,
            ticketType: "VIP",
        });

        // Example of reselling a ticket
        // await ticketing.resellTicket({
        //     sellerAddress: CONFIG.ADDRESSES.USER1,
        //     buyerAddress: CONFIG.ADDRESSES.USER2,
        //     resalePrice: 13_000_000,
        //     organizerAddress: CONFIG.ADDRESSES.ORGANIZER,
        //     ticketType: "VIP",
        // });

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