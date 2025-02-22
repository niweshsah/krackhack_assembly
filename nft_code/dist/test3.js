"use strict";
// import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// const INITIAL_BALANCE = 100_000_000; // 1 APT
// const TICKET_PRICE = 5_000_000; // 0.05 APT (5M Octas)
// const APTOS_NETWORK = Network.DEVNET;
// const config = new AptosConfig({ network: APTOS_NETWORK });
// const aptos = new Aptos(config);
// // Helper function to fetch and print balances
// const printBalances = async (accounts: { name: string; account: Account }[]) => {
//     for (const { name, account } of accounts) {
//         const balance = await aptos.getAccountAPTAmount({ accountAddress: account.accountAddress });
//         console.log(`${name} Balance: ${balance / 100_000_000} APT`);
//     }
//     console.log();
// };
// const ticketingSystem = async () => {
//     console.log("🎟 NFT Ticketing System: Organizer sells tickets, users buy and resell with royalties.\n");
//     // Create organizer and multiple user accounts
//     const organizer = Account.generate();
//     const users = [Account.generate(), Account.generate(), Account.generate()]; // 3 users
//     console.log(`Organizer Address: ${organizer.accountAddress}`);
//     users.forEach((user, index) => {
//         console.log(`User ${index + 1} Address: ${user.accountAddress}`);
//     });
//     console.log();
//     // Fund organizer and user accounts
//     await aptos.fundAccount({ accountAddress: organizer.accountAddress, amount: INITIAL_BALANCE });
//     for (const user of users) {
//         await aptos.fundAccount({ accountAddress: user.accountAddress, amount: INITIAL_BALANCE });
//     }
//     // Print initial balances
//     console.log("💰 Initial Balances:");
//     await printBalances([{ name: "Organizer", account: organizer }, ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user }))]);
//     // Organizer creates ticket collection with royalties
//     const collectionName = "Concert Tickets";
//     const collectionDescription = "Exclusive event tickets.";
//     const collectionURI = "https://example.com/tickets";
//     console.log("✅ Organizer is creating a ticket collection with 10% royalties...\n");
//     const createCollectionTxn = await aptos.createCollectionTransaction({
//         creator: organizer,
//         description: collectionDescription,
//         name: collectionName,
//         uri: collectionURI,
//         royaltyNumerator: 10, // 10% royalty
//         royaltyDenominator: 100,
//         royaltyPayeeAddress: organizer.accountAddress, // Organizer receives royalties
//     });
//     let committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: createCollectionTxn });
//     await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
//     console.log("🎨 Collection created successfully with 10% royalties!\n");
//     // Mint multiple tickets as NFTs
//     const ticketName = "VIP Ticket";
//     const ticketDescription = "Access to VIP area.";
//     const ticketURI = "https://example.com/vip-ticket";
//     const numberOfTickets = 5; // Mint 5 tickets
//     console.log(`✅ Organizer is minting ${numberOfTickets} ticket NFTs...\n`);
//     for (let i = 0; i < numberOfTickets; i++) {
//         const mintTicketTxn = await aptos.mintDigitalAssetTransaction({
//             creator: organizer,
//             collection: collectionName,
//             description: ticketDescription,
//             name: `${ticketName} #${i + 1}`,
//             uri: ticketURI,
//         });
//         committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: mintTicketTxn });
//         await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
//     }
//     console.log(`🎟 ${numberOfTickets} Ticket NFTs minted successfully!\n`);
//     // Fetch organizer's tickets
//     let organizerTickets = await aptos.getOwnedDigitalAssets({ ownerAddress: organizer.accountAddress });
//     console.log(`📦 Organizer's ticket count: ${organizerTickets.length}\n`);
//     // Users buy tickets from the organizer
//     for (let i = 0; i < users.length; i++) {
//         const user = users[i];
//         console.log(`💰 User ${i + 1} is buying a ticket...\n`);
//         // Payment from user to organizer
//         const paymentTxn = await aptos.transaction.build.simple({
//             sender: user.accountAddress,
//             data: {
//                 function: "0x1::aptos_account::transfer",
//                 functionArguments: [organizer.accountAddress, TICKET_PRICE],
//             },
//         });
//         committedTxn = await aptos.signAndSubmitTransaction({ signer: user, transaction: paymentTxn });
//         await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
//         console.log(`✅ User ${i + 1} payment successful!\n`);
//         // Transfer the NFT ticket to the user
//         console.log(`📤 Transferring a ticket to User ${i + 1}...\n`);
//         const transferTxn = await aptos.transferDigitalAssetTransaction({
//             sender: organizer,
//             digitalAssetAddress: organizerTickets[i].token_data_id,
//             recipient: user.accountAddress,
//         });
//         committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: transferTxn });
//         await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
//         console.log(`🎟 Ticket successfully transferred to User ${i + 1}!\n`);
//     }
//     // Users resell tickets to each other with royalties
//     console.log("🔄 Users are reselling tickets with royalties...\n");
//     // User 1 sells their ticket to User 2
//     const seller = users[0];
//     const buyer = users[1];
//     console.log(`💰 User 1 is selling their ticket to User 2...\n`);
//     const royaltyAmount = TICKET_PRICE * 0.10; // 10% royalty
//     const sellerAmount = TICKET_PRICE - royaltyAmount;
//     // Buyer pays seller
//     const resellPaymentTxn = await aptos.transaction.build.simple({
//         sender: buyer.accountAddress,
//         data: {
//             function: "0x1::aptos_account::transfer",
//             functionArguments: [seller.accountAddress, sellerAmount],
//         },
//     });
//     committedTxn = await aptos.signAndSubmitTransaction({ signer: buyer, transaction: resellPaymentTxn });
//     await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
//     // Buyer pays royalty to the organizer
//     const royaltyPaymentTxn = await aptos.transaction.build.simple({
//         sender: buyer.accountAddress,
//         data: {
//             function: "0x1::aptos_account::transfer",
//             functionArguments: [organizer.accountAddress, royaltyAmount],
//         },
//     });
//     committedTxn = await aptos.signAndSubmitTransaction({ signer: buyer, transaction: royaltyPaymentTxn });
//     await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
//     console.log(`✅ User 2 paid User 1 and a 10% royalty to the Organizer!\n`);
//     // Transfer the NFT ticket from User 1 to User 2
//     console.log(`📤 Transferring the ticket from User 1 to User 2...\n`);
//     const sellerTickets = await aptos.getOwnedDigitalAssets({ ownerAddress: seller.accountAddress });
//     const resellTransferTxn = await aptos.transferDigitalAssetTransaction({
//         sender: seller,
//         digitalAssetAddress: sellerTickets[0].token_data_id,
//         recipient: buyer.accountAddress,
//     });
//     committedTxn = await aptos.signAndSubmitTransaction({ signer: seller, transaction: resellTransferTxn });
//     await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
//     console.log(`🎟 Ticket successfully transferred from User 1 to User 2!\n`);
// };
// ticketingSystem();
