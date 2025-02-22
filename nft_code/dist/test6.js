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
const INITIAL_BALANCE = 100000000; // 1 APT
const TICKET_PRICE = 5000000; // 0.05 APT (5M Octas)
const MAX_RESALE_PRICE = 8000000; // 0.08 APT
const ROYALTY_PERCENTAGE = 10; // 10% royalty to organizer
const APTOS_NETWORK = ts_sdk_1.Network.DEVNET;
const config = new ts_sdk_1.AptosConfig({ network: APTOS_NETWORK });
const aptos = new ts_sdk_1.Aptos(config);
// Helper function to print balances
const printBalances = (accounts) => __awaiter(void 0, void 0, void 0, function* () {
    for (const { name, account } of accounts) {
        const balance = yield aptos.getAccountAPTAmount({ accountAddress: account.accountAddress });
        console.log(`${name} Balance: ${balance / 100000000} APT`);
    }
    console.log();
});
const ticketingSystem = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🎟 NFT Ticketing System: Organizer sells tickets, users buy and resell with royalties.");
    const organizer = ts_sdk_1.Account.generate();
    const users = [ts_sdk_1.Account.generate(), ts_sdk_1.Account.generate()];
    console.log(`Organizer Address: ${organizer.accountAddress}`);
    users.forEach((user, index) => console.log(`User ${index + 1} Address: ${user.accountAddress}`));
    // Fund organizer and users
    yield aptos.fundAccount({ accountAddress: organizer.accountAddress, amount: INITIAL_BALANCE });
    for (const user of users) {
        yield aptos.fundAccount({ accountAddress: user.accountAddress, amount: INITIAL_BALANCE });
    }
    console.log("💰 Initial Balances:");
    yield printBalances([
        { name: "Organizer", account: organizer },
        ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
    ]);
    // Organizer creates ticket collection
    const collectionName = "Concert Tickets";
    const collectionDescription = "Exclusive event tickets.";
    const collectionURI = "https://example.com/tickets";
    console.log("✅ Organizer is creating a ticket collection...");
    const createCollectionTxn = yield aptos.createCollectionTransaction({
        creator: organizer,
        description: collectionDescription,
        name: collectionName,
        uri: collectionURI,
    });
    let committedTxn = yield aptos.signAndSubmitTransaction({ signer: organizer, transaction: createCollectionTxn });
    yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log("🎨 Collection created successfully!");
    // Mint multiple tickets
    const ticketName = "VIP Ticket";
    const ticketURI = "https://example.com/vip-ticket";
    const totalTickets = 5; // Total tickets available
    console.log(`✅ Organizer is minting ${totalTickets} ticket NFTs...`);
    for (let i = 0; i < totalTickets; i++) {
        const mintTicketTxn = yield aptos.mintDigitalAssetTransaction({
            creator: organizer,
            collection: collectionName,
            description: "Access to VIP area.",
            name: `${ticketName} #${i + 1}`,
            uri: ticketURI,
        });
        committedTxn = yield aptos.signAndSubmitTransaction({ signer: organizer, transaction: mintTicketTxn });
        yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    }
    console.log(`🎟 ${totalTickets} Ticket NFTs minted successfully!`);
    // Users buy multiple tickets
    console.log("🛒 Users are buying multiple tickets from the Organizer...");
    const ticketsPerUser = 2;
    for (const buyer of users) {
        for (let i = 0; i < ticketsPerUser; i++) {
            // Payment from user to organizer
            const buyTicketTxn = yield aptos.transaction.build.simple({
                sender: buyer.accountAddress,
                data: {
                    function: "0x1::aptos_account::transfer",
                    functionArguments: [organizer.accountAddress, TICKET_PRICE],
                },
            });
            committedTxn = yield aptos.signAndSubmitTransaction({ signer: buyer, transaction: buyTicketTxn });
            yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
            // Transfer ticket from Organizer to User
            let organizerTickets = yield aptos.getOwnedDigitalAssets({ ownerAddress: organizer.accountAddress });
            if (organizerTickets.length > 0) {
                const transferTicketTxn = yield aptos.transferDigitalAssetTransaction({
                    sender: organizer,
                    digitalAssetAddress: organizerTickets[0].token_data_id,
                    recipient: buyer.accountAddress,
                });
                committedTxn = yield aptos.signAndSubmitTransaction({ signer: organizer, transaction: transferTicketTxn });
                yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
                console.log(`🎟 Ticket transferred to ${buyer.accountAddress}.`);
            }
            else {
                console.error(`❌ Organizer has no tickets left to sell.`);
            }
        }
    }
    console.log("💰 Balances after ticket purchases:");
    yield printBalances([
        { name: "Organizer", account: organizer },
        ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
    ]);
    // Users resell tickets with custom prices and royalties
    console.log("🔄 Users are reselling tickets with royalties...");
    const seller = users[0];
    const buyer = users[1];
    const resalePrice = 7000000; // Seller sets a resale price (should be ≤ MAX_RESALE_PRICE)
    if (resalePrice > MAX_RESALE_PRICE) {
        console.log(`❌ Resale price too high! Maximum allowed: ${MAX_RESALE_PRICE / 100000000} APT`);
        return;
    }
    const royaltyAmount = (resalePrice * ROYALTY_PERCENTAGE) / 100;
    console.log(`💰 User 1 is selling a ticket to User 2 for ${resalePrice / 100000000} APT with ${ROYALTY_PERCENTAGE}% royalty.`);
    // Payment from buyer to seller
    const resellPaymentTxn = yield aptos.transaction.build.simple({
        sender: buyer.accountAddress,
        data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [seller.accountAddress, resalePrice - royaltyAmount],
        },
    });
    committedTxn = yield aptos.signAndSubmitTransaction({ signer: buyer, transaction: resellPaymentTxn });
    yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    // Payment from buyer to organizer as royalty
    const royaltyTxn = yield aptos.transaction.build.simple({
        sender: buyer.accountAddress,
        data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [organizer.accountAddress, royaltyAmount],
        },
    });
    committedTxn = yield aptos.signAndSubmitTransaction({ signer: buyer, transaction: royaltyTxn });
    yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log(`✅ Royalty of ${royaltyAmount / 100000000} APT paid to Organizer.`);
    // Transfer the NFT ticket from User 1 to User 2
    const sellerTickets = yield aptos.getOwnedDigitalAssets({ ownerAddress: seller.accountAddress });
    if (sellerTickets.length > 0) {
        const resellTransferTxn = yield aptos.transferDigitalAssetTransaction({
            sender: seller,
            digitalAssetAddress: sellerTickets[0].token_data_id,
            recipient: buyer.accountAddress,
        });
        committedTxn = yield aptos.signAndSubmitTransaction({ signer: seller, transaction: resellTransferTxn });
        yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        console.log(`🎟 Ticket successfully transferred from User 1 to User 2 with royalty paid.`);
    }
    else {
        console.error("❌ User 1 does not have any tickets to sell.");
    }
    console.log("💰 Final Balances:");
    yield printBalances([
        { name: "Organizer", account: organizer },
        ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
    ]);
});
ticketingSystem();
