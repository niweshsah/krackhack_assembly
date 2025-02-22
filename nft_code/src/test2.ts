import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const INITIAL_BALANCE = 100_000_000 // 1 APT --> I was probably getting  upper bound of int
const TICKET_PRICE = 5_000_000; // 0.05 APT (5M Octas)
const APTOS_NETWORK = Network.DEVNET;

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

// Helper function to fetch and print balances
const printBalances = async (accounts: { name: string; account: Account }[]) => {
    for (const { name, account } of accounts) {
        const balance = await aptos.getAccountAPTAmount({ accountAddress: account.accountAddress });
        console.log(`${name} Balance: ${balance / 100_000_000} APT`);
        // console.log(`${name} Balance: ${balance} APT`);
    }
    console.log();
};

const ticketingSystem = async () => {
    console.log("🎟 NFT Ticketing System: Organizer sells tickets, users buy and resell.\n");

    // Create organizer and multiple user accounts
    const organizer = Account.generate();
    const users = [Account.generate(), Account.generate(), Account.generate()]; // 3 users

    console.log(`Organizer Address: ${organizer.accountAddress}`);
    users.forEach((user, index) => {
        console.log(`User ${index + 1} Address: ${user.accountAddress}`);
    });
    console.log();

    // Fund organizer and user accounts
    await aptos.fundAccount({ accountAddress: organizer.accountAddress, amount: INITIAL_BALANCE });
    for (const user of users) {
        await aptos.fundAccount({ accountAddress: user.accountAddress, amount: INITIAL_BALANCE });
    }

    // Print initial balances
    console.log("💰 Initial Balances:");

    await printBalances([
        { name: "Organizer", account: organizer },
        ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
    ]);

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

    // Mint multiple tickets as NFTs
    const ticketName = "VIP Ticket";
    const ticketDescription = "Access to VIP area.";
    const ticketURI = "https://example.com/vip-ticket";
    const numberOfTickets = 5; // Mint 5 tickets

    console.log(`✅ Organizer is minting ${numberOfTickets} ticket NFTs...\n`);
    for (let i = 0; i < numberOfTickets; i++) {
        const mintTicketTxn = await aptos.mintDigitalAssetTransaction({
            creator: organizer,
            collection: collectionName,
            description: ticketDescription,
            name: `${ticketName} #${i + 1}`,
            uri: ticketURI,
        });
        committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: mintTicketTxn });
        await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    }

    console.log(`🎟 ${numberOfTickets} Ticket NFTs minted successfully!\n`);

    // Fetch organizer's tickets
    let organizerTickets = await aptos.getOwnedDigitalAssets({ ownerAddress: organizer.accountAddress });
    console.log(`📦 Organizer's ticket count: ${organizerTickets.length}\n`);

    // Users buy tickets from the organizer
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        console.log(`💰 User ${i + 1} is buying a ticket...\n`);

        // Check user's balance before buying
        const userBalance = await aptos.getAccountAPTAmount({ accountAddress: user.accountAddress });
        if (userBalance < TICKET_PRICE) {
            console.log(`❌ User ${i + 1} does not have enough balance to buy a ticket.`);
            continue;
        }

        // Payment from user to organizer
        const paymentTxn = await aptos.transaction.build.simple({
            sender: user.accountAddress,
            data: {
                function: "0x1::aptos_account::transfer",
                functionArguments: [organizer.accountAddress, TICKET_PRICE],
            },
        });
        committedTxn = await aptos.signAndSubmitTransaction({ signer: user, transaction: paymentTxn });
        await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

        console.log(`✅ User ${i + 1} payment successful!\n`);

        // Transfer the NFT ticket to the user
        console.log(`📤 Transferring a ticket to User ${i + 1}...\n`);
        const transferTxn = await aptos.transferDigitalAssetTransaction({
            sender: organizer,
            digitalAssetAddress: organizerTickets[i].token_data_id,
            recipient: user.accountAddress,
        });
        committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: transferTxn });
        await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

        console.log(`🎟 Ticket successfully transferred to User ${i + 1}!\n`);

        // Print balances after purchase
        console.log("💰 Balances after purchase:");
        await printBalances([
            { name: "Organizer", account: organizer },
            ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
        ]);
    }

    // Verify ticket ownership after purchase
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const userTickets = await aptos.getOwnedDigitalAssets({ ownerAddress: user.accountAddress });
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
    const buyerBalance = await aptos.getAccountAPTAmount({ accountAddress: buyer.accountAddress });
    if (buyerBalance < TICKET_PRICE) {
        console.log(`❌ User 2 does not have enough balance to buy the ticket.`);
    } else {
        // Payment from buyer to seller
        const resellPaymentTxn = await aptos.transaction.build.simple({
            sender: buyer.accountAddress,
            data: {
                function: "0x1::aptos_account::transfer",
                functionArguments: [seller.accountAddress, TICKET_PRICE],
            },
        });
        committedTxn = await aptos.signAndSubmitTransaction({ signer: buyer, transaction: resellPaymentTxn });
        await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

        console.log(`✅ User 2 payment to User 1 successful!\n`);

        // Transfer the NFT ticket from User 1 to User 2
        console.log(`📤 Transferring the ticket from User 1 to User 2...\n`);
        
        const sellerTickets = await aptos.getOwnedDigitalAssets({ ownerAddress: seller.accountAddress });
        const resellTransferTxn = await aptos.transferDigitalAssetTransaction({
            sender: seller,
            digitalAssetAddress: sellerTickets[0].token_data_id,
            recipient: buyer.accountAddress,
        });
        committedTxn = await aptos.signAndSubmitTransaction({ signer: seller, transaction: resellTransferTxn });
        await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

        console.log(`🎟 Ticket successfully transferred from User 1 to User 2!\n`);

        // Print balances after resale
        console.log("💰 Balances after resale:");
        await printBalances([
            { name: "Organizer", account: organizer },
            ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
        ]);
    }

    // Verify ticket ownership after resale
    const sellerTicketsAfterResale = await aptos.getOwnedDigitalAssets({ ownerAddress: seller.accountAddress });
    const buyerTicketsAfterResale = await aptos.getOwnedDigitalAssets({ ownerAddress: buyer.accountAddress });
    console.log(`✅ User 1 now owns ${sellerTicketsAfterResale.length} ticket(s)!`);
    console.log(`✅ User 2 now owns ${buyerTicketsAfterResale.length} ticket(s)!`);
};

ticketingSystem();