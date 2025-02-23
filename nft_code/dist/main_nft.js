"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
// =============== Constants ===============
const CONFIG = {
    INITIAL_BALANCE: 100000000, // 1 APT
    TICKET_PRICES: {
        VIP: 10000000, // 0.10 APT for VIP tickets
        NORMAL: 5000000, // 0.05 APT for normal tickets
    },
    MAX_RESALE_PRICES: {
        VIP: 15000000, // 0.15 APT max resale for VIP
        NORMAL: 8000000, // 0.08 APT max resale for normal
    },
    ROYALTY_PERCENTAGE: 10, // 10%
    NETWORK: ts_sdk_1.Network.DEVNET,
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
        this.config = new ts_sdk_1.AptosConfig({ network: CONFIG.NETWORK });
        this.aptos = new ts_sdk_1.Aptos(this.config);
    }
    // =============== Private Helper Methods ===============
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
    printBalances(accounts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("\nCurrent Balances:");
                for (const { name, account } of accounts) {
                    const balance = yield this.aptos.getAccountAPTAmount({
                        accountAddress: account.accountAddress,
                    });
                    console.log(`${name} Balance: ${balance / 100000000} APT`);
                }
                console.log();
            }
            catch (error) {
                throw new TicketingError("Failed to fetch account balances", error);
            }
        });
    }
    mintTicketNFT(creator, collectionName, ticketName, ticketURI, totalTickets, ticketType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`✅ Starting to mint ${totalTickets} ${ticketType} ticket NFTs...`);
                for (let i = 0; i < totalTickets; i++) {
                    console.log(`Minting ticket ${i + 1} of ${totalTickets}...`);
                    const mintTicketTxn = yield this.aptos.mintDigitalAssetTransaction({
                        creator,
                        collection: collectionName,
                        description: ticketType,
                        name: `${ticketName} #${i + 1}`,
                        uri: ticketURI,
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
    viewAccountTokens(accountAddress, ticketType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokens = yield this.aptos.getAccountOwnedTokens({ accountAddress });
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
        return __awaiter(this, arguments, void 0, function* ({ buyer, seller, ticketType }) {
            try {
                const price = CONFIG.TICKET_PRICES[ticketType];
                if (!price) {
                    throw new TicketingError(`Invalid ticket type: ${ticketType}`);
                }
                console.log(`🛒 ${buyer.accountAddress} is buying a ${ticketType} ticket from ${seller.accountAddress} for ${price / 100000000} APT`);
                const buyerBalance = yield this.aptos.getAccountAPTAmount({
                    accountAddress: buyer.accountAddress,
                });
                if (buyerBalance < price) {
                    throw new InsufficientFundsError();
                }
                const sellerTickets = yield this.aptos.getOwnedDigitalAssets({
                    ownerAddress: seller.accountAddress,
                });
                if (!sellerTickets.length) {
                    throw new NoTicketsAvailableError();
                }
                const firstMatchingToken = sellerTickets.find((token) => { var _a; return ((_a = token.current_token_data) === null || _a === void 0 ? void 0 : _a.description) === ticketType; });
                if (!firstMatchingToken) {
                    throw new NoTicketsAvailableError(`No ${ticketType} tickets available`);
                }
                const tokenDataId = firstMatchingToken.token_data_id;
                // Execute payment transaction
                const paymentTxn = yield this.aptos.transaction.build.simple({
                    sender: buyer.accountAddress,
                    data: {
                        function: "0x1::aptos_account::transfer",
                        functionArguments: [seller.accountAddress, price],
                    },
                });
                yield this.submitTransactionWithRetry(buyer, paymentTxn);
                // Transfer ticket
                const transferTicketTxn = yield this.aptos.transferDigitalAssetTransaction({
                    sender: seller,
                    digitalAssetAddress: tokenDataId,
                    recipient: buyer.accountAddress,
                });
                yield this.submitTransactionWithRetry(seller, transferTicketTxn);
                console.log(`🎟 ${ticketType} ticket successfully transferred to ${buyer.accountAddress}`);
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
        return __awaiter(this, arguments, void 0, function* ({ seller, buyer, resalePrice, organizer, ticketType, }) {
            try {
                const maxResalePrice = CONFIG.MAX_RESALE_PRICES[ticketType];
                if (!maxResalePrice) {
                    throw new TicketingError(`Invalid ticket type: ${ticketType}`);
                }
                if (resalePrice > maxResalePrice) {
                    throw new TicketingError(`Resale price exceeds maximum allowed for ${ticketType}: ${maxResalePrice / 100000000} APT`);
                }
                const royaltyAmount = Math.floor((resalePrice * CONFIG.ROYALTY_PERCENTAGE) / 100);
                const sellerAmount = resalePrice - royaltyAmount;
                console.log(`🔄 ${seller.accountAddress} is reselling a ${ticketType} ticket to ${buyer.accountAddress} for ${resalePrice / 100000000} APT with ${CONFIG.ROYALTY_PERCENTAGE}% royalty`);
                // Execute main sale
                yield this.buyTicket({
                    buyer,
                    seller,
                    ticketType,
                });
                // Pay royalty
                const royaltyTxn = yield this.aptos.transaction.build.simple({
                    sender: buyer.accountAddress,
                    data: {
                        function: "0x1::aptos_account::transfer",
                        functionArguments: [organizer.accountAddress, royaltyAmount],
                    },
                });
                yield this.submitTransactionWithRetry(buyer, royaltyTxn);
                console.log(`✅ Royalty of ${royaltyAmount / 100000000} APT paid to Organizer`);
            }
            catch (error) {
                throw new TicketingError("Failed to complete ticket resale", error);
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
    initializeAccounts(organizer, users) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("🏦 Initializing accounts with initial balance...");
                yield this.aptos.fundAccount({
                    accountAddress: organizer.accountAddress,
                    amount: CONFIG.INITIAL_BALANCE,
                });
                for (const user of users) {
                    yield this.aptos.fundAccount({
                        accountAddress: user.accountAddress,
                        amount: CONFIG.INITIAL_BALANCE,
                    });
                }
                console.log("✅ All accounts initialized successfully");
            }
            catch (error) {
                throw new TicketingError("Failed to initialize accounts", error);
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
            // Initialize accounts
            console.log("\n1. Creating Accounts");
            console.log("-------------------");
            const organizer = ts_sdk_1.Account.generate();
            const users = [ts_sdk_1.Account.generate(), ts_sdk_1.Account.generate()];
            yield ticketing.initializeAccounts(organizer, users);
            // Print initial balances
            const accounts = [
                { name: "Organizer", account: organizer },
                ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
            ];
            yield ticketing.printBalances(accounts);
            // Create collection
            console.log("\n2. Creating Ticket Collection");
            console.log("--------------------------");
            const collectionInfo = {
                name: "Concert Tickets",
                uri: "https://example.com/tickets",
                description: "Exclusive event tickets.",
            };
            yield ticketing.createCollection(organizer, collectionInfo);
            // Mint VIP tickets
            console.log("\n3.a Minting VIP Tickets");
            console.log("----------------");
            yield ticketing.mintTicketNFT(organizer, collectionInfo.name, "tickets for event", "https://example.com/vip-ticket", 2, "VIP");
            // Mint normal tickets
            console.log("\n3.b Minting Normal Tickets");
            console.log("----------------");
            yield ticketing.mintTicketNFT(organizer, collectionInfo.name, "tickets for event", "https://example.com/normal-ticket", 2, "NORMAL");
            // Initial ticket sales
            console.log("\n4. Initial Ticket Sales");
            console.log("---------------------");
            yield ticketing.buyTicket({
                buyer: users[0],
                seller: organizer,
                ticketType: "VIP",
            });
            yield ticketing.buyTicket({
                buyer: users[1],
                seller: organizer,
                ticketType: "NORMAL",
            });
            console.log("\nBalances after initial sales:");
            yield ticketing.printBalances(accounts);
            // Resell ticket
            console.log("\n5. Ticket Resale");
            console.log("---------------");
            yield ticketing.resellTicket({
                seller: users[0],
                buyer: users[1],
                resalePrice: 13000000, // Increased to be within VIP max resale price
                organizer,
                ticketType: "VIP",
            });
            console.log("\nFinal Balances:");
            yield ticketing.printBalances(accounts);
        }
        catch (error) {
            if (error instanceof TicketingError) {
                console.error("\n❌ Ticketing system error:", error.message);
                if (error.cause) {
                    console.error("Caused by:", error.cause);
                }
            }
            else {
                console.error("\n❌ Unexpected error:", error);
            }
            process.exit(1);
        }
    });
}

// export default {TicketingSystem};
// export default TicketingSystem;
module.exports = TicketingSystem;

// Run the system
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
