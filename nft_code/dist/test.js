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
const INITIAL_BALANCE = 1000000000; // 10 APT
const TICKET_PRICE = 50000000; // 0.5 APT (50M Octas)
const APTOS_NETWORK = Network.DEVNET;
// const APTOS_NETWORK = Network.LOCAL;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);
const ticketingSystem = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🎟 NFT Ticketing System: Organizer sells tickets, users buy.\n");
    // Create organizer and user accounts
    const organizer = Account.generate();
    const user = Account.generate();
    console.log(`Organizer Address: ${organizer.accountAddress}`);
    console.log(`User Address: ${user.accountAddress}\n`);
    // Fund both accounts
    yield aptos.fundAccount({ accountAddress: organizer.accountAddress, amount: INITIAL_BALANCE });
    yield aptos.fundAccount({ accountAddress: user.accountAddress, amount: INITIAL_BALANCE });
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
    // Mint a ticket as NFT
    const ticketName = "VIP Ticket";
    const ticketDescription = "Access to VIP area.";
    const ticketURI = "https://example.com/vip-ticket";
    console.log("✅ Organizer is minting a ticket NFT...\n");
    const mintTicketTxn = yield aptos.mintDigitalAssetTransaction({
        creator: organizer,
        collection: collectionName,
        description: ticketDescription,
        name: ticketName,
        uri: ticketURI,
    });
    committedTxn = yield aptos.signAndSubmitTransaction({ signer: organizer, transaction: mintTicketTxn });
    yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log("🎟 Ticket NFT minted successfully!\n");
    // Fetch ticket details
    const organizerTickets = yield aptos.getOwnedDigitalAssets({ ownerAddress: organizer.accountAddress });
    console.log(`📦 Organizer's ticket count: ${organizerTickets.length}\n`);
    // User buys the ticket (crypto payment first, then NFT transfer)
    console.log("💰 User is buying the ticket...\n");
    const paymentTxn = yield aptos.transaction.build.simple({
        sender: user.accountAddress,
        data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [organizer.accountAddress, TICKET_PRICE],
        },
    });
    committedTxn = yield aptos.signAndSubmitTransaction({ signer: user, transaction: paymentTxn });
    yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log("✅ Payment successful!\n");
    // Transfer the NFT ticket to the user
    console.log("📤 Transferring the ticket to the user...\n");
    const transferTxn = yield aptos.transferDigitalAssetTransaction({
        sender: organizer,
        digitalAssetAddress: organizerTickets[0].token_data_id,
        recipient: user.accountAddress,
    });
    committedTxn = yield aptos.signAndSubmitTransaction({ signer: organizer, transaction: transferTxn });
    yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log("🎟 Ticket successfully transferred to the user!\n");
    // Verify ownership transfer
    const userTickets = yield aptos.getOwnedDigitalAssets({ ownerAddress: user.accountAddress });
    console.log(`✅ User now owns ${userTickets.length} ticket(s)!\n`);
});
ticketingSystem();
