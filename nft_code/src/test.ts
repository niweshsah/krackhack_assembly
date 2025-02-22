import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const INITIAL_BALANCE = 1_000_000_000; // 10 APT
const TICKET_PRICE = 50_000_000; // 0.5 APT (50M Octas)
const APTOS_NETWORK = Network.DEVNET;
// const APTOS_NETWORK = Network.LOCAL;

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const ticketingSystem = async () => {
    console.log("🎟 NFT Ticketing System: Organizer sells tickets, users buy.\n");

    // Create organizer and user accounts
    const organizer = Account.generate();
    const user = Account.generate();

    console.log(`Organizer Address: ${organizer.accountAddress}`);
    console.log(`User Address: ${user.accountAddress}\n`);

    // Fund both accounts
    await aptos.fundAccount({ accountAddress: organizer.accountAddress, amount: INITIAL_BALANCE });
    await aptos.fundAccount({ accountAddress: user.accountAddress, amount: INITIAL_BALANCE });

    // Organizer creates ticket collection
    const collectionName = "Concert Tickets";
    const collectionDescription = "Exclusive event tickets.";
    const collectionURI = "https://example.com/tickets";

    console.log("✅ Organizer is creating a ticket collection...\n");
    const createCollectionTxn = await aptos.createCollectionTransaction({
        creator: organizer,
        description: collectionDescription,
        name: collectionName,
        uri: collectionURI,
    });
    let committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: createCollectionTxn });
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    console.log("🎨 Collection created successfully!\n");

    // Mint a ticket as NFT
    const ticketName = "VIP Ticket";
    const ticketDescription = "Access to VIP area.";
    const ticketURI = "https://example.com/vip-ticket";

    console.log("✅ Organizer is minting a ticket NFT...\n");
    const mintTicketTxn = await aptos.mintDigitalAssetTransaction({
        creator: organizer,
        collection: collectionName,
        description: ticketDescription,
        name: ticketName,
        uri: ticketURI,
    });
    committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: mintTicketTxn });
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    console.log("🎟 Ticket NFT minted successfully!\n");

    // Fetch ticket details
    const organizerTickets = await aptos.getOwnedDigitalAssets({ ownerAddress: organizer.accountAddress });
    console.log(`📦 Organizer's ticket count: ${organizerTickets.length}\n`);

    // User buys the ticket (crypto payment first, then NFT transfer)
    console.log("💰 User is buying the ticket...\n");

    const paymentTxn = await aptos.transaction.build.simple({
        sender: user.accountAddress,
        data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [organizer.accountAddress, TICKET_PRICE],
        },
    });

    committedTxn = await aptos.signAndSubmitTransaction({ signer: user, transaction: paymentTxn });
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    console.log("✅ Payment successful!\n");

    // Transfer the NFT ticket to the user
    console.log("📤 Transferring the ticket to the user...\n");

    const transferTxn = await aptos.transferDigitalAssetTransaction({
        sender: organizer,
        digitalAssetAddress: organizerTickets[0].token_data_id,
        recipient: user.accountAddress,
    });
    committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: transferTxn });
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    console.log("🎟 Ticket successfully transferred to the user!\n");

    // Verify ownership transfer
    const userTickets = await aptos.getOwnedDigitalAssets({ ownerAddress: user.accountAddress });
    console.log(`✅ User now owns ${userTickets.length} ticket(s)!\n`);
};

ticketingSystem();
