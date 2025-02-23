var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// Constants
const CONFIG = {
    INITIAL_BALANCE: 100000000, // 1 APT
    TICKET_PRICE: 5000000, // 0.05 APT
    MAX_RESALE_PRICE: 8000000, // 0.08 APT
    ROYALTY_PERCENTAGE: 10, // 10%
    NETWORK: Network.DEVNET,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second
};
// Error class
class TicketingError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = "TicketingError";
    }
}
// Ticketing System Class
class TicketingSystem {
    fetchUserNFTs(user) {
        throw new Error("Method not implemented.");
    }
    constructor() {
        this.config = new AptosConfig({ network: CONFIG.NETWORK });
        this.aptos = new Aptos(this.config);
    }
    initializeAccounts(organizer, users) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🏦 Initializing accounts with initial balance...');
                yield this.aptos.fundAccount({
                    accountAddress: organizer.accountAddress,
                    amount: CONFIG.INITIAL_BALANCE
                });
                for (const user of users) {
                    yield this.aptos.fundAccount({
                        accountAddress: user.accountAddress,
                        amount: CONFIG.INITIAL_BALANCE
                    });
                }
                console.log('✅ All accounts initialized successfully');
            }
            catch (error) {
                throw new TicketingError('Failed to initialize accounts', error);
            }
        });
    }
    waitWithRetry(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
                try {
                    yield this.aptos.waitForTransaction({ transactionHash: hash });
                    return;
                }
                catch (error) {
                    if (attempt === CONFIG.MAX_RETRIES)
                        throw error;
                    yield new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
                }
            }
        });
    }
    submitTransactionWithRetry(signer, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
                try {
                    const txn = yield this.aptos.signAndSubmitTransaction({ signer, transaction });
                    yield this.waitWithRetry(txn.hash);
                    return txn.hash;
                }
                catch (error) {
                    console.error(`Transaction failed (Attempt ${attempt}):`, error);
                    if (attempt === CONFIG.MAX_RETRIES)
                        throw new TicketingError("Max retry attempts reached", error);
                    yield new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
                }
            }
            throw new TicketingError("Unexpected error in transaction submission");
        });
    }
    printBalances(accounts) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("\n🔍 Fetching account balances...");
            for (const { name, account } of accounts) {
                try {
                    const balance = yield this.aptos.getAccountAPTAmount({ accountAddress: account.accountAddress });
                    console.log(`${name} Balance: ${balance / 100000000} APT`);
                }
                catch (error) {
                    console.error(`❌ Failed to fetch balance for ${name}:`, error);
                }
            }
        });
    }
    mintTicketNFT(creator, collectionName, ticketName, ticketURI, totalTickets) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n🎟 Minting ${totalTickets} Ticket NFTs...`);
            for (let i = 0; i < totalTickets; i++) {
                console.log(`Minting ticket ${i + 1} of ${totalTickets}...`);
                try {
                    const mintTxn = yield this.aptos.mintDigitalAssetTransaction({
                        creator,
                        collection: collectionName,
                        description: "Event Access Ticket",
                        name: `${ticketName} #${i + 1}`,
                        uri: ticketURI,
                    });
                    yield this.submitTransactionWithRetry(creator, mintTxn);
                    console.log(`✅ Ticket ${i + 1} minted successfully!`);
                    if (i < totalTickets - 1) {
                        console.log(`⏳ Waiting for 1 seconds before minting the next ticket...`);
                        yield new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
                catch (error) {
                    console.error(`❌ Failed to mint Ticket ${i + 1}:`, error);
                }
            }
        });
    }
    createCollection(creator, collectionInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("\n🎨 Creating NFT Collection...");
            try {
                const txn = yield this.aptos.createCollectionTransaction({
                    creator,
                    name: collectionInfo.name,
                    uri: collectionInfo.uri,
                    description: collectionInfo.description,
                });
                yield this.submitTransactionWithRetry(creator, txn);
                console.log(`✅ Collection '${collectionInfo.name}' created successfully!`);
            }
            catch (error) {
                console.error("❌ Failed to create collection:", error);
            }
        });
    }
}
// Main f
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("\n🎟 Starting NFT Ticketing System\n==============================");
            const ticketing = new TicketingSystem();
            console.log("\n1️⃣ Creating Accounts...");
            const organizer = Account.generate();
            const user = Account.generate();
            const accounts = [
                { name: "Organizer", account: organizer },
                { name: "User", account: user }
            ];
            // ✅ Fund accounts before proceeding
            yield ticketing.initializeAccounts(organizer, [user]);
            yield ticketing.printBalances(accounts);
            console.log("\n2️⃣ Creating NFT Collection...");
            const collectionInfo = {
                name: "Event Tickets",
                uri: "https://example.com/tickets",
                description: "Exclusive access event tickets."
            };
            yield ticketing.createCollection(organizer, collectionInfo);
            console.log("\n3️⃣ Minting NFT Tickets...");
            yield ticketing.mintTicketNFT(organizer, collectionInfo.name, "VIP Ticket", "https://example.com/vip-ticket", 3);
            console.log("\n4️⃣ Fetching User's NFTs...");
            ticketing.fetchUserNFTs(user);
            console.log("\n✅ NFT Ticketing System Execution Completed!");
        }
        catch (error) {
            console.error("❌ Unexpected error:", error);
            process.exit(1);
        }
    });
}
// Run the system
main();
