import {
    Account,
    Aptos,
    AptosConfig,
    Ed25519Account,
    InputViewFunctionData,
    Network,
    TransactionResponse
  } from "@aptos-labs/ts-sdk";
  
  // Constants
  const CONFIG = {
    INITIAL_BALANCE: 100_000_000, // 1 APT
    TICKET_PRICE: 5_000_000, // 0.05 APT
    MAX_RESALE_PRICE: 8_000_000, // 0.08 APT
    ROYALTY_PERCENTAGE: 10, // 10%
    NETWORK: Network.DEVNET,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    MINT_DELAY: 1000 // 1 second between mints
  } as const;
  
  // Types
  interface AccountInfo {
    name: string;
    account: Ed25519Account;
  }
  
  interface BuyTicketParams {
    buyer: Ed25519Account;
    seller: Ed25519Account;
    price: number;
  }
  
  interface ResellTicketParams {
    seller: Ed25519Account;
    buyer: Ed25519Account;
    resalePrice: number;
    organizer: Ed25519Account;
  }
  
  interface CollectionInfo {
    name: string;
    uri: string;
    description: string;
  }
  
  // Custom error class
  class TicketingError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(message);
        this.name = 'TicketingError';
    }
  }
  
  class TicketingSystem {
    private readonly aptos: Aptos;
    private readonly config: AptosConfig;
  
    constructor() {
        this.config = new AptosConfig({ network: CONFIG.NETWORK });
        this.aptos = new Aptos(this.config);
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
  
    private async submitTransactionWithRetry(
        signer: Ed25519Account,
        transaction: any
    ): Promise<string> {
        let lastError;
  
        for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
            try {
                const committedTxn = await this.aptos.signAndSubmitTransaction({
                    signer,
                    transaction
                });
  
                await this.waitWithRetry(committedTxn.hash);
                return committedTxn.hash;
            } catch (error: any) {
                lastError = error;
  
                if (error?.data?.error_code === 'invalid_transaction_update') {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
                    continue;
                }
  
                throw new TicketingError('Transaction submission failed', error);
            }
        }
  
        throw new TicketingError('Max retry attempts reached', lastError);
    }
  
    async printBalances(accounts: AccountInfo[]): Promise<void> {
        try {
            console.log('\nCurrent Balances:');
            for (const { name, account } of accounts) {
                const balance = await this.aptos.getAccountAPTAmount({
                    accountAddress: account.accountAddress
                });
                console.log(`${name} Balance: ${balance / 100_000_000} APT`);
            }
            console.log();
        } catch (error) {
            throw new TicketingError('Failed to fetch account balances', error);
        }
    }
  
    async mintTicketNFT(
        creator: Ed25519Account,
        collectionName: string,
        ticketName: string,
        ticketURI: string,
        totalTickets: number
    ): Promise<void> {
  
        try {
            console.log(`✅ Starting to mint ${totalTickets} ticket NFTs...`);
  
            for (let i = 0; i < totalTickets; i++) {
                console.log(`Minting ticket ${i + 1} of ${totalTickets}...`);
  
                const mintTicketTxn = await this.aptos.mintDigitalAssetTransaction({
                    creator,
                    collection: collectionName,
                    description: "Access to VIP area.",
                    name: `${ticketName} #${i + 1}`,
                    uri: ticketURI,
                });
  
                await this.submitTransactionWithRetry(creator, mintTicketTxn);
  
                if (i < totalTickets - 1) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.MINT_DELAY));
                }
            }
  
            console.log(`🎟 All ${totalTickets} Ticket NFTs minted successfully!`);
  
  
            const tokens = await this.viewAccountTokens(creator.accountAddress.toString());
            // console.log('tokens by creator:', tokens);
  
  
        } catch (error) {
            throw new TicketingError('Failed to mint ticket NFTs', error);
        }
    }
  
    async viewTicketData(owner: string): Promise<any> {
        try {
            console.log(`Fetching ticket data for ${owner}...`);
            const payload: InputViewFunctionData = {
                function: "0x1::token::get_token_data",
                functionArguments: [owner],
            };
            console.log(`Payload:`, payload);
  
            const chainId = (await this.aptos.view({ payload }))[0];
            // return await this.aptos.view({ payload });
            console.log(`Chain ID:`, chainId);
            return chainId;
  
        } catch (error) {
            throw new TicketingError('Failed to fetch ticket data', error);
        }
    }
  
  
  
    async fetchTokenMetadata(tokenDataId: string): Promise<any> {
        try {
            // Fetch the token data from the Aptos blockchain
  
            console.log('tokenDataId-69:', tokenDataId);
  
            const tokenData = await this.aptos.getAccountResource({
                accountAddress: tokenDataId,
                resourceType: "0x3::token::TokenData",
            });
  
            console.log('tokenData:', tokenData);
  
            // Extract metadata from the token data
            const metadata = {
                name: tokenData.name,
                description: tokenData.description,
                uri: tokenData.uri, // URI pointing to the off-chain metadata (e.g., JSON file)
                properties: tokenData.properties, // Additional properties
            };
  
  
  
            return metadata;
        } catch (error) {
            throw new TicketingError('Failed to fetch token metadata', error);
        }
    }
  
  
    async viewAccountTokens(accountAddress: string) {
        const tokens = await this.aptos.getAccountOwnedTokens({ accountAddress });
  
        if (tokens.length > 0) {
            console.log("First owned token:", tokens[0]);
            return tokens[0];  // Return only the first token
        } else {
            console.log("No tokens found for this account.");
            return null;
        }
    }
  
  
  
    async buyTicket(
        { buyer, seller, price }: BuyTicketParams
    ): Promise<void> {
        try {
            console.log(`🛒 ${buyer.accountAddress} is buying a ticket from ${seller.accountAddress} for ${price / 100_000_000} APT`);
  
            // Check buyer's balance
            const buyerBalance = await this.aptos.getAccountAPTAmount({
                accountAddress: buyer.accountAddress
            });
  
            if (buyerBalance < price) {
                throw new TicketingError('Insufficient funds for purchase');
            }
  
            // Fetch seller's tickets
            const sellerTickets = await this.aptos.getOwnedDigitalAssets({
                ownerAddress: seller.accountAddress
            });
  
            if (!sellerTickets.length) {
                throw new TicketingError('Seller has no tickets available');
            }
  
            // Get the first ticket's token data ID
            const tokenDataId = sellerTickets[0].token_data_id;
  
            console.log('tokenDataId:', tokenDataId);
  
            // Proceed with the payment transaction
            const paymentTxn = await this.aptos.transaction.build.simple({
                sender: buyer.accountAddress,
                data: {
                    function: "0x1::aptos_account::transfer",
                    functionArguments: [seller.accountAddress, price],
                },
            });
  
            await this.submitTransactionWithRetry(buyer, paymentTxn);
  
            // Transfer the ticket to the buyer
            const transferTicketTxn = await this.aptos.transferDigitalAssetTransaction({
                sender: seller,
                digitalAssetAddress: tokenDataId,
                recipient: buyer.accountAddress,
            });
  
            await this.submitTransactionWithRetry(seller, transferTicketTxn);
  
            console.log(`🎟 Ticket successfully transferred to ${buyer.accountAddress}`);
        } catch (error) {
            throw new TicketingError('Failed to complete ticket purchase', error);
        }
    }
  
  
    async resellTicket(
        { seller, buyer, resalePrice, organizer }: ResellTicketParams
    ): Promise<void> {
        try {
            if (resalePrice > CONFIG.MAX_RESALE_PRICE) {
                throw new TicketingError(
                    `Resale price exceeds maximum allowed: ${CONFIG.MAX_RESALE_PRICE / 100_000_000} APT`
                );
            }
  
            const royaltyAmount = Math.floor((resalePrice * CONFIG.ROYALTY_PERCENTAGE) / 100);
            const sellerAmount = resalePrice - royaltyAmount;
  
            console.log(
                `🔄 ${seller.accountAddress} is reselling a ticket to ${buyer.accountAddress} ` +
                `for ${resalePrice / 100_000_000} APT with ${CONFIG.ROYALTY_PERCENTAGE}% royalty`
            );
  
            // Execute main sale
            await this.buyTicket({
                buyer,
                seller,
                price: sellerAmount
            });
  
            // Pay royalty to organizer
            const royaltyTxn = await this.aptos.transaction.build.simple({
                sender: buyer.accountAddress,
                data: {
                    function: "0x1::aptos_account::transfer",
                    functionArguments: [organizer.accountAddress, royaltyAmount],
                },
            });
  
            await this.submitTransactionWithRetry(buyer, royaltyTxn);
            console.log(`✅ Royalty of ${royaltyAmount / 100_000_000} APT paid to Organizer`);
        } catch (error) {
            throw new TicketingError('Failed to complete ticket resale', error);
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
            throw new TicketingError('Failed to create collection', error);
        }
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
  }
  
  async function main() {
    try {
        console.log("🎟 Starting NFT Ticketing System");
        console.log("================================");
  
        const ticketing = new TicketingSystem();
  
        // Initialize accounts
        console.log("\n1. Creating Accounts");
        console.log("-------------------");
        const organizer = Account.generate();
        const users = [Account.generate(), Account.generate()];
        await ticketing.initializeAccounts(organizer, users);
  
        // Print initial balances
        const accounts: AccountInfo[] = [
            { name: "Organizer", account: organizer },
            ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user }))
        ];
        await ticketing.printBalances(accounts);
  
        // Create collection
        console.log("\n2. Creating Ticket Collection");
        console.log("--------------------------");
        const collectionInfo: CollectionInfo = {
            name: "Concert Tickets",
            uri: "https://example.com/tickets",
            description: "Exclusive event tickets."
        };
        await ticketing.createCollection(organizer, collectionInfo);
  
        // Mint tickets
        console.log("\n3. Minting Tickets");
        console.log("----------------");
        await ticketing.mintTicketNFT(
            organizer,
            collectionInfo.name,
            "VIP Ticket",
            "https://example.com/vip-ticket",
            2
        );
  
        // Users buy tickets
        console.log("\n4. Initial Ticket Sales");
        console.log("---------------------");
        await ticketing.buyTicket({
            buyer: users[0],
            seller: organizer,
            price: CONFIG.TICKET_PRICE
        });
        await ticketing.buyTicket({
            buyer: users[1],
            seller: organizer,
            price: CONFIG.TICKET_PRICE
        });
  
        console.log("\nBalances after initial sales:");
        await ticketing.printBalances(accounts);
  
        // Resell a ticket
        console.log("\n5. Ticket Resale");
        console.log("---------------");
        await ticketing.resellTicket({
            seller: users[0],
            buyer: users[1],
            resalePrice: 7_000_000,
            organizer
        });
  
        console.log("\nFinal Balances:");
        await ticketing.printBalances(accounts);
  
    } catch (error) {
        if (error instanceof TicketingError) {
            console.error('\n❌ Ticketing system error:', error.message);
            if (error.cause) {
                console.error('Caused by:', error.cause);
            }
        } else {
            console.error('\n❌ Unexpected error:', error);
        }
        process.exit(1);
    }
  }
  
  // Run the system
  main();