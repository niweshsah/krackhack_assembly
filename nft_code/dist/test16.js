var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Account, Aptos, AptosConfig, Network, AccountAddress, Ed25519PrivateKey, } from "@aptos-labs/ts-sdk";
// =============== Constants ===============
const CONFIG = {
    TICKET_PRICES: {
        VIP: 10000000, // 0.10 APT for VIP tickets
        NORMAL: 5000000, // 0.05 APT for normal tickets
    },
    MAX_RESALE_PRICES: {
        VIP: 15000000, // 0.15 APT max resale for VIP
        NORMAL: 8000000, // 0.08 APT max resale for normal
    },
    ROYALTY_PERCENTAGE: 10, // 10%
    NETWORK: Network.TESTNET,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    MINT_DELAY: 1000, // 1 second between mints
};
// =============== Custom Error Classes ===============
class TicketingError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = "TicketingError";
    }
}
class InsufficientFundsError extends TicketingError {
    constructor(message = "Insufficient funds for transaction") {
        super(message);
        this.name = "InsufficientFundsError";
    }
}
class NoTicketsAvailableError extends TicketingError {
    constructor(message = "No tickets available") {
        super(message);
        this.name = "NoTicketsAvailableError";
    }
}
class TransactionError extends TicketingError {
    constructor(message, cause) {
        super(message, cause);
        this.name = "TransactionError";
    }
}
// =============== Main Ticketing System Class ===============
class TicketingSystem {
    constructor() {
        this.config = new AptosConfig({ network: CONFIG.NETWORK });
        this.aptos = new Aptos(this.config);
    }
    // =============== Private Helper Methods ===============
    ensureAccountAddress(address) {
        if (typeof address === 'string') {
            return AccountAddress.fromString(address);
        }
        return address;
    }
    waitWithRetry(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
                try {
                    yield this.aptos.waitForTransaction({ transactionHash: hash });
                    return;
                }
                catch (error) {
                    if (attempt === CONFIG.MAX_RETRIES) {
                        throw new TransactionError("Transaction confirmation failed", error);
                    }
                    yield new Promise((resolve) => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
                }
            }
        });
    }
    submitTransactionWithRetry(signer, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let lastError;
            console.log("Submitting transaction...");
            for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
                try {
                    const committedTxn = yield this.aptos.signAndSubmitTransaction({
                        signer,
                        transaction,
                    });
                    yield this.waitWithRetry(committedTxn.hash);
                    return committedTxn.hash;
                }
                catch (error) {
                    lastError = error;
                    if (((_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error_code) === "invalid_transaction_update") {
                        yield new Promise((resolve) => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
                        continue;
                    }
                    throw new TransactionError("Transaction submission failed", error);
                }
            }
            throw new TransactionError("Max retry attempts reached", lastError);
        });
    }
    // =============== Public Methods ===============
    printBalance(address, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountAddress = this.ensureAccountAddress(address);
                const balance = yield this.aptos.getAccountAPTAmount({
                    accountAddress: accountAddress.toString(),
                });
                console.log(`${name} Balance: ${balance / 100000000} APT`);
            }
            catch (error) {
                throw new TicketingError("Failed to fetch account balance", error);
            }
        });
    }
    createCollection(creator, collectionInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createCollectionTxn = yield this.aptos.createCollectionTransaction({
                    creator,
                    description: collectionInfo.description,
                    name: collectionInfo.name,
                    uri: collectionInfo.uri,
                });
                yield this.submitTransactionWithRetry(creator, createCollectionTxn);
                console.log("🎨 Collection created successfully!");
            }
            catch (error) {
                throw new TicketingError("Failed to create collection", error);
            }
        });
    }
    mintTicketNFT(creator, collectionName, ticketName, ticketURI, totalTickets, ticketType, royaltyAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const royaltyAccountAddress = this.ensureAccountAddress(royaltyAddress);
                console.log(`✅ Starting to mint ${totalTickets} ${ticketType} ticket NFTs...`);
                for (let i = 0; i < totalTickets; i++) {
                    console.log(`Minting ticket ${i + 1} of ${totalTickets}...`);
                    const mintTicketTxn = yield this.aptos.mintDigitalAssetTransaction({
                        creator,
                        collection: collectionName,
                        description: ticketType,
                        name: `${ticketName} #${i + 1}`,
                        uri: ticketURI,
                        // royaltyPayeeAddress: royaltyAccountAddress,
                        // royaltyPointsDenominator: 100,
                        // royaltyPointsNumerator: CONFIG.ROYALTY_PERCENTAGE,
                    });
                    yield this.submitTransactionWithRetry(creator, mintTicketTxn);
                    if (i < totalTickets - 1) {
                        yield new Promise((resolve) => setTimeout(resolve, CONFIG.MINT_DELAY));
                    }
                }
                console.log(`🎟 All ${totalTickets} Ticket NFTs minted successfully!`);
            }
            catch (error) {
                throw new TicketingError("Failed to mint ticket NFTs", error);
            }
        });
    }
    viewAccountTokens(address, ticketType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountAddress = this.ensureAccountAddress(address);
                const tokens = yield this.aptos.getAccountOwnedTokens({
                    accountAddress: accountAddress.toString()
                });
                if (tokens.length > 0) {
                    const firstMatchingToken = tokens.find((token) => { var _a; return ((_a = token.current_token_data) === null || _a === void 0 ? void 0 : _a.description) === ticketType; });
                    if (firstMatchingToken) {
                        console.log(`\n🎟 First '${ticketType}' ticket found:`, firstMatchingToken);
                        return firstMatchingToken;
                    }
                    console.log(`No '${ticketType}' tickets found for this account.`);
                    return null;
                }
                console.log("No tokens found for this account.");
                return null;
            }
            catch (error) {
                throw new TicketingError("Failed to fetch account tokens", error);
            }
        });
    }
    buyTicket(_a) {
        return __awaiter(this, arguments, void 0, function* ({ buyerAddress, sellerAccount, ticketType }) {
            try {
                const buyerAccountAddress = this.ensureAccountAddress(buyerAddress);
                const price = CONFIG.TICKET_PRICES[ticketType];
                if (!price) {
                    throw new TicketingError(`Invalid ticket type: ${ticketType}`);
                }
                console.log(`🛒 ${buyerAccountAddress.toString()} is buying a ${ticketType} ticket from ${sellerAccount.accountAddress.toString()} for ${price / 100000000} APT`);
                const buyerBalance = yield this.aptos.getAccountAPTAmount({
                    accountAddress: buyerAccountAddress.toString(),
                });
                if (buyerBalance < price) {
                    throw new InsufficientFundsError();
                }
                const sellerTickets = yield this.aptos.getOwnedDigitalAssets({
                    ownerAddress: sellerAccount.accountAddress.toString(),
                });
                if (!sellerTickets.length) {
                    throw new NoTicketsAvailableError();
                }
                const firstMatchingToken = sellerTickets.find((token) => { var _a; return ((_a = token.current_token_data) === null || _a === void 0 ? void 0 : _a.description) === ticketType; });
                if (!firstMatchingToken) {
                    throw new NoTicketsAvailableError(`No ${ticketType} tickets available`);
                }
                const tokenDataId = firstMatchingToken.token_data_id;
                // Payment transaction
                // const paymentTxn = await this.aptos.transaction.build.simple({
                //     sender: buyerAccountAddress.toString(),
                //     data: {
                //         function: "0x1::aptos_account::transfer",
                //         functionArguments: [sellerAccount.accountAddress, price],
                //     },
                // });
                // await this.submitTransactionWithRetry(sellerAccount, paymentTxn);
                // Transfer ticket transaction
                const transferTicketTxn = yield this.aptos.transferDigitalAssetTransaction({
                    sender: sellerAccount,
                    digitalAssetAddress: tokenDataId,
                    recipient: buyerAccountAddress,
                });
                yield this.submitTransactionWithRetry(sellerAccount, transferTicketTxn);
                console.log(`🎟 ${ticketType} ticket successfully transferred to ${buyerAccountAddress.toString()}`);
            }
            catch (error) {
                if (error instanceof TicketingError) {
                    throw error;
                }
                throw new TicketingError("Failed to complete ticket purchase", error);
            }
        });
    }
    resellTicket(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sellerAccount, buyerAddress, resalePrice, organizerAddress, ticketType, }) {
            try {
                const buyerAccountAddress = this.ensureAccountAddress(buyerAddress);
                const organizerAccountAddress = this.ensureAccountAddress(organizerAddress);
                const maxResalePrice = CONFIG.MAX_RESALE_PRICES[ticketType];
                if (!maxResalePrice) {
                    throw new TicketingError(`Invalid ticket type: ${ticketType}`);
                }
                if (resalePrice > maxResalePrice) {
                    throw new TicketingError(`Resale price exceeds maximum allowed for ${ticketType}: ${maxResalePrice / 100000000} APT`);
                }
                const royaltyAmount = Math.floor((resalePrice * CONFIG.ROYALTY_PERCENTAGE) / 100);
                console.log(`🔄 ${sellerAccount.accountAddress.toString()} is reselling a ${ticketType} ticket to ${buyerAccountAddress.toString()} for ${resalePrice / 100000000} APT with ${CONFIG.ROYALTY_PERCENTAGE}% royalty`);
                // Execute ticket transfer with royalty payment
                yield this.buyTicket({
                    buyerAddress: buyerAccountAddress,
                    sellerAccount,
                    ticketType,
                });
                // Process royalty payment to organizer
                const royaltyTxn = yield this.aptos.transaction.build.simple({
                    sender: buyerAccountAddress.toString(),
                    data: {
                        function: "0x1::aptos_account::transfer",
                        functionArguments: [organizerAccountAddress, royaltyAmount],
                    },
                });
                yield this.submitTransactionWithRetry(sellerAccount, royaltyTxn);
                console.log(`✅ ${ticketType} ticket resold successfully with ${royaltyAmount / 100000000} APT royalty to ${organizerAccountAddress.toString()}`);
            }
            catch (error) {
                throw new TicketingError("Failed to complete ticket resale", error);
            }
        });
    }
}
// =============== Main Function ===============
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("🎟 Starting NFT Ticketing System");
            console.log("================================");
            const ticketing = new TicketingSystem();
            // Initialize backend account
            const backendPrivateKey = new Ed25519PrivateKey("0x7d90b6baf67a4f6e8a9194df96ca1115ce8dfae22b1e980d81e01ac798c2056d");
            const backend = Account.fromPrivateKey({ privateKey: backendPrivateKey });
            // Set up addresses
            const ORGANIZER_ADDRESS = AccountAddress.fromString("0xa53709fb9b81a068f5c4868c62c2513463411995184fb00a7e3c6166b58c9cd1");
            const USER1_ADDRESS = AccountAddress.fromString("0xb5f96a6656d1b7353ea188666db490bdd9091ae7a987a75432e8c742c1995253");
            const USER2_ADDRESS = AccountAddress.fromString("0x3e6d013285fe67aec5b7c757498378f31f1b188ff1796488baf0a1e88640edf0");
            // Print initial balances
            console.log("\nInitial Balances:");
            yield ticketing.printBalance(backend.accountAddress, "Backend");
            yield ticketing.printBalance(ORGANIZER_ADDRESS, "Organizer");
            yield ticketing.printBalance(USER1_ADDRESS, "User 1");
            yield ticketing.printBalance(USER2_ADDRESS, "User 2");
            // Create collection
            console.log("\nCreating Ticket Collection");
            const collectionInfo = {
                name: "Concert Tickets5", // make sure it is unique and not already created
                uri: "https://example.com/tickets",
                description: "Exclusive event tickets.",
            };
            yield ticketing.createCollection(backend, collectionInfo);
            // Mint VIP tickets with royalty to organizer
            console.log("\nMinting VIP Tickets");
            yield ticketing.mintTicketNFT(backend, collectionInfo.name, "VIP Ticket", "https://example.com/vip-ticket", 2, "VIP", ORGANIZER_ADDRESS);
            // Mint normal tickets with royalty to organizer
            // console.log("\nMinting Normal Tickets");
            // await ticketing.mintTicketNFT(
            //     backend,
            //     collectionInfo.name,
            //     "Normal Ticket",
            //     "https://example.com/normal-ticket",
            //     2,
            //     "NORMAL",
            //     ORGANIZER_ADDRESS
            // );
            // Sell tickets to users
            console.log("\nSelling tickets to users");
            // Sell VIP ticket to User 1
            yield ticketing.buyTicket({
                buyerAddress: USER1_ADDRESS,
                sellerAccount: backend,
                ticketType: "VIP"
            });
            // Sell normal ticket to User 2
            // await ticketing.buyTicket({
            //     buyerAddress: USER2_ADDRESS,
            //     sellerAccount: backend,
            //     ticketType: "NORMAL"
            // });
            // Demonstrate resale functionality
            console.log("\nDemonstrating ticket resale");
            // Convert User1 to account for resale
            // const user1PrivateKey = new Ed25519PrivateKey("YOUR_USER1_PRIVATE_KEY"); // Replace with actual private key
            // const user1Account = Account.fromPrivateKey({ privateKey: user1PrivateKey });
            // // User 1 resells VIP ticket to User 2
            // await ticketing.resellTicket({
            //     sellerAccount: user1Account,
            //     buyerAddress: USER2_ADDRESS,
            //     resalePrice: CONFIG.MAX_RESALE_PRICES.VIP,
            //     organizerAddress: ORGANIZER_ADDRESS,
            //     ticketType: "VIP"
            // });
            // View tokens for each account
            console.log("\nViewing final token distribution:");
            yield ticketing.viewAccountTokens(backend.accountAddress, "VIP");
            yield ticketing.viewAccountTokens(backend.accountAddress, "NORMAL");
            yield ticketing.viewAccountTokens(USER1_ADDRESS, "VIP");
            // await ticketing.viewAccountTokens(USER2_ADDRESS, "NORMAL");
            // Print final balances
            console.log("\nFinal Balances:");
            yield ticketing.printBalance(backend.accountAddress, "Backend");
            // await ticketing.printBalance(ORGANIZER_ADDRESS, "Organizer");
            // await ticketing.printBalance(USER1_ADDRESS, "User 1");
            // await ticketing.printBalance(USER2_ADDRESS, "User 2");
            console.log("\n✅ NFT Ticketing System operations completed successfully");
        }
        catch (error) {
            console.error("\n❌ Error:", error);
            process.exit(1);
        }
    });
}
// Run the system
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
