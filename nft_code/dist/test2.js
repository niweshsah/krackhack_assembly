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
const INITIAL_BALANCE = 100000000; // 1 APT --> I was probably getting  upper bound of int
const TICKET_PRICE = 5000000; // 0.05 APT (5M Octas)
const APTOS_NETWORK = ts_sdk_1.Network.DEVNET;
const config = new ts_sdk_1.AptosConfig({ network: APTOS_NETWORK });
const aptos = new ts_sdk_1.Aptos(config);
// Helper function to fetch and print balances
const printBalances = (accounts) => __awaiter(void 0, void 0, void 0, function* () {
    for (const { name, account } of accounts) {
        const balance = yield aptos.getAccountAPTAmount({ accountAddress: account.accountAddress });
        console.log(`${name} Balance: ${balance / 100000000} APT`);
        // console.log(`${name} Balance: ${balance} APT`);
    }
    console.log();
});
const ticketingSystem = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🎟 NFT Ticketing System: Organizer sells tickets, users buy and resell.\n");
    // Create organizer and multiple user accounts
    const organizer = ts_sdk_1.Account.generate();
    const users = [ts_sdk_1.Account.generate(), ts_sdk_1.Account.generate(), ts_sdk_1.Account.generate()]; // 3 users
    console.log(`Organizer Address: ${organizer.accountAddress}`);
    users.forEach((user, index) => {
        console.log(`User ${index + 1} Address: ${user.accountAddress}`);
    });
    console.log();
    // Fund organizer and user accounts
    yield aptos.fundAccount({ accountAddress: organizer.accountAddress, amount: INITIAL_BALANCE });
    for (const user of users) {
        yield aptos.fundAccount({ accountAddress: user.accountAddress, amount: INITIAL_BALANCE });
    }
    // Print initial balances
    console.log("💰 Initial Balances:");
    yield printBalances([
        { name: "Organizer", account: organizer },
        ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
    ]);
    // Organizer creates ticket collection
    const collectionName = "Concert Tickets";
    const collectionDescription = "Exclusive event tickets.";
    const collectionURI = "https://example.com/tickets";
    console.log("✅ Organizer is creating a ticket collection...\n");
    const createCollectionTxn = yield aptos.createCollectionTransaction({
        creator: organizer,
        description: collectionDescription,
        name: collectionName,
        uri: collectionURI,
    });
    let committedTxn = yield aptos.signAndSubmitTransaction({ signer: organizer, transaction: createCollectionTxn });
    yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log("🎨 Collection created successfully!\n");
    // Mint multiple tickets as NFTs
    const ticketName = "VIP Ticket";
    const ticketDescription = "Access to VIP area.";
    const ticketURI = "https://example.com/vip-ticket";
    const numberOfTickets = 5; // Mint 5 tickets
    console.log(`✅ Organizer is minting ${numberOfTickets} ticket NFTs...\n`);
    for (let i = 0; i < numberOfTickets; i++) {
        const mintTicketTxn = yield aptos.mintDigitalAssetTransaction({
            creator: organizer,
            collection: collectionName,
            description: ticketDescription,
            name: `${ticketName} #${i + 1}`,
            uri: ticketURI,
        });
        committedTxn = yield aptos.signAndSubmitTransaction({ signer: organizer, transaction: mintTicketTxn });
        yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    }
    console.log(`🎟 ${numberOfTickets} Ticket NFTs minted successfully!\n`);
    // Fetch organizer's tickets
    let organizerTickets = yield aptos.getOwnedDigitalAssets({ ownerAddress: organizer.accountAddress });
    console.log(`📦 Organizer's ticket count: ${organizerTickets.length}\n`);
    // Users buy tickets from the organizer
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        console.log(`💰 User ${i + 1} is buying a ticket...\n`);
        // Check user's balance before buying
        const userBalance = yield aptos.getAccountAPTAmount({ accountAddress: user.accountAddress });
        if (userBalance < TICKET_PRICE) {
            console.log(`❌ User ${i + 1} does not have enough balance to buy a ticket.`);
            continue;
        }
        // Payment from user to organizer
        const paymentTxn = yield aptos.transaction.build.simple({
            sender: user.accountAddress,
            data: {
                function: "0x1::aptos_account::transfer",
                functionArguments: [organizer.accountAddress, TICKET_PRICE],
            },
        });
        committedTxn = yield aptos.signAndSubmitTransaction({ signer: user, transaction: paymentTxn });
        yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        console.log(`✅ User ${i + 1} payment successful!\n`);
        // Transfer the NFT ticket to the user
        console.log(`📤 Transferring a ticket to User ${i + 1}...\n`);
        const transferTxn = yield aptos.transferDigitalAssetTransaction({
            sender: organizer,
            digitalAssetAddress: organizerTickets[i].token_data_id,
            recipient: user.accountAddress,
        });
        committedTxn = yield aptos.signAndSubmitTransaction({ signer: organizer, transaction: transferTxn });
        yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        console.log(`🎟 Ticket successfully transferred to User ${i + 1}!\n`);
        // Print balances after purchase
        console.log("💰 Balances after purchase:");
        yield printBalances([
            { name: "Organizer", account: organizer },
            ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
        ]);
    }
    // Verify ticket ownership after purchase
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const userTickets = yield aptos.getOwnedDigitalAssets({ ownerAddress: user.accountAddress });
        console.log(`✅ User ${i + 1} now owns ${userTickets.length} ticket(s)!`);
    }
    console.log();
    // Users resell tickets to each other
    console.log("🔄 Users are reselling tickets to each other...\n");
    // User 1 sells their ticket to User 2
    const seller = users[0];
    const buyer = users[1];
    console.log(`💰 User 1 is selling their ticket to User 2...\n`);
    // Check buyer's balance before buying
    const buyerBalance = yield aptos.getAccountAPTAmount({ accountAddress: buyer.accountAddress });
    if (buyerBalance < TICKET_PRICE) {
        console.log(`❌ User 2 does not have enough balance to buy the ticket.`);
    }
    else {
        // Payment from buyer to seller
        const resellPaymentTxn = yield aptos.transaction.build.simple({
            sender: buyer.accountAddress,
            data: {
                function: "0x1::aptos_account::transfer",
                functionArguments: [seller.accountAddress, TICKET_PRICE],
            },
        });
        committedTxn = yield aptos.signAndSubmitTransaction({ signer: buyer, transaction: resellPaymentTxn });
        yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        console.log(`✅ User 2 payment to User 1 successful!\n`);
        // Transfer the NFT ticket from User 1 to User 2
        console.log(`📤 Transferring the ticket from User 1 to User 2...\n`);
        const sellerTickets = yield aptos.getOwnedDigitalAssets({ ownerAddress: seller.accountAddress });
        const resellTransferTxn = yield aptos.transferDigitalAssetTransaction({
            sender: seller,
            digitalAssetAddress: sellerTickets[0].token_data_id,
            recipient: buyer.accountAddress,
        });
        committedTxn = yield aptos.signAndSubmitTransaction({ signer: seller, transaction: resellTransferTxn });
        yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        console.log(`🎟 Ticket successfully transferred from User 1 to User 2!\n`);
        // Print balances after resale
        console.log("💰 Balances after resale:");
        yield printBalances([
            { name: "Organizer", account: organizer },
            ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
        ]);
    }
    // Verify ticket ownership after resale
    const sellerTicketsAfterResale = yield aptos.getOwnedDigitalAssets({ ownerAddress: seller.accountAddress });
    const buyerTicketsAfterResale = yield aptos.getOwnedDigitalAssets({ ownerAddress: buyer.accountAddress });
    console.log(`✅ User 1 now owns ${sellerTicketsAfterResale.length} ticket(s)!`);
    console.log(`✅ User 2 now owns ${buyerTicketsAfterResale.length} ticket(s)!`);
});
ticketingSystem();
