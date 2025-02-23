var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Aptos, AptosConfig, Network, } from "@aptos-labs/ts-sdk";
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
    NETWORK: Network.TESTNET,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    MINT_DELAY: 1000, // 1 second between mints
    ADDRESSES: {
        ORGANIZER: "0xa53709fb9b81a068f5c4868c62c2513463411995184fb00a7e3c6166b58c9cd1",
        USER1: "0xb5f96a6656d1b7353ea188666db490bdd9091ae7a987a75432e8c742c1995253",
        USER2: "0x3e6d013285fe67aec5b7c757498378f31f1b188ff1796488baf0a1e88640edf0"
    }
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
    // =============== Public Methods ===============
    printBalances(accounts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("\nCurrent Balances:");
                for (const { name, address } of accounts) {
                    const balance = yield this.aptos.getAccountAPTAmount({
                        accountAddress: address,
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
        return __awaiter(this, arguments, void 0, function* ({ buyerAddress, sellerAddress, ticketType }) {
            try {
                const price = CONFIG.TICKET_PRICES[ticketType];
                if (!price) {
                    throw new TicketingError(`Invalid ticket type: ${ticketType}`);
                }
                console.log(`🛒 ${buyerAddress} is buying a ${ticketType} ticket from ${sellerAddress} for ${price / 100000000} APT`);
                const buyerBalance = yield this.aptos.getAccountAPTAmount({
                    accountAddress: buyerAddress,
                });
                if (buyerBalance < price) {
                    throw new InsufficientFundsError();
                }
                const sellerTickets = yield this.aptos.getOwnedDigitalAssets({
                    ownerAddress: sellerAddress,
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
                    sender: buyerAddress,
                    data: {
                        function: "0x1::aptos_account::transfer",
                        functionArguments: [sellerAddress, price],
                    },
                });
                // Note: You'll need to implement the actual transaction signing here
                // This will require the private keys of the accounts
                console.log(`🎟 ${ticketType} ticket successfully transferred to ${buyerAddress}`);
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
        return __awaiter(this, arguments, void 0, function* ({ sellerAddress, buyerAddress, resalePrice, organizerAddress, ticketType, }) {
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
                console.log(`🔄 ${sellerAddress} is reselling a ${ticketType} ticket to ${buyerAddress} for ${resalePrice / 100000000} APT with ${CONFIG.ROYALTY_PERCENTAGE}% royalty`);
                // Execute main sale
                yield this.buyTicket({
                    buyerAddress,
                    sellerAddress,
                    ticketType,
                });
                // Note: You'll need to implement the actual transaction signing here
                // This will require the private keys of the accounts
                console.log(`✅ Royalty of ${royaltyAmount / 100000000} APT paid to Organizer`);
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
            // Initialize account info
            const accounts = [
                { name: "Organizer", address: CONFIG.ADDRESSES.ORGANIZER },
                { name: "User 1", address: CONFIG.ADDRESSES.USER1 },
                { name: "User 2", address: CONFIG.ADDRESSES.USER2 },
            ];
            // Print initial balances
            yield ticketing.printBalances(accounts);
            // Example of buying a ticket
            yield ticketing.buyTicket({
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
// Run the system
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
