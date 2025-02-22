import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const INITIAL_BALANCE = 100_000_000 // 1 APT
const TICKET_PRICE = 5_000_000; // 0.05 APT (5M Octas)
const ROYALTY_PERCENTAGE = 10; // 10% royalty to organizer
const APTOS_NETWORK = Network.DEVNET;

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

// Helper function to print balances
const printBalances = async (accounts: { name: string; account: Account }[]) => {
    for (const { name, account } of accounts) {
        const balance = await aptos.getAccountAPTAmount({ accountAddress: account.accountAddress });
        console.log(`${name} Balance: ${balance / 100_000_000} APT`);
    }
    console.log();
};

const ticketingSystem = async () => {
    console.log("🎟 NFT Ticketing System: Organizer sells tickets, users buy and resell with royalties.");

    // Create organizer and multiple user accounts
    const organizer = Account.generate();
    const users = [Account.generate(), Account.generate(), Account.generate()]; // 3 users

    console.log(`Organizer Address: ${organizer.accountAddress}`);
    users.forEach((user, index) => {
        console.log(`User ${index + 1} Address: ${user.accountAddress}`);
    });
    console.log();

    // Fund organizer and users
    await aptos.fundAccount({ accountAddress: organizer.accountAddress, amount: INITIAL_BALANCE });
    for (const user of users) {
        await aptos.fundAccount({ accountAddress: user.accountAddress, amount: INITIAL_BALANCE });
    }

    console.log("💰 Initial Balances:");
    await printBalances([
        { name: "Organizer", account: organizer },
        ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
    ]);

    // Organizer creates ticket collection
    const collectionName = "Concert Tickets";
    const collectionDescription = "Exclusive event tickets.";
    const collectionURI = "https://example.com/tickets";

    console.log("✅ Organizer is creating a ticket collection...");
    const createCollectionTxn = await aptos.createCollectionTransaction({
        creator: organizer,
        description: collectionDescription,
        name: collectionName,
        uri: collectionURI,
    });
    let committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: createCollectionTxn });
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    console.log("🎨 Collection created successfully!");

    // Mint multiple tickets as NFTs
    const ticketName = "VIP Ticket";
    const ticketDescription = "Access to VIP area.";
    const ticketURI = "https://example.com/vip-ticket";
    const numberOfTickets = users.length; // 1 ticket per user

    console.log(`✅ Organizer is minting ${numberOfTickets} ticket NFTs...`);
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

    console.log(`🎟 ${numberOfTickets} Ticket NFTs minted successfully!`);

    // Users buy tickets from organizer
    console.log("🛒 Users are buying tickets from the Organizer...");
    for (let i = 0; i < users.length; i++) {
        const buyer = users[i];

        // Payment from user to organizer
        const buyTicketTxn = await aptos.transaction.build.simple({
            sender: buyer.accountAddress,
            data: {
                function: "0x1::aptos_account::transfer",
                functionArguments: [organizer.accountAddress, TICKET_PRICE],
            },
        });

        committedTxn = await aptos.signAndSubmitTransaction({ signer: buyer, transaction: buyTicketTxn });
        await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

        // Transfer ticket from Organizer to User
        let organizerTickets = await aptos.getOwnedDigitalAssets({ ownerAddress: organizer.accountAddress });

        if (organizerTickets.length > 0) {
            const transferTicketTxn = await aptos.transferDigitalAssetTransaction({
                sender: organizer,
                digitalAssetAddress: organizerTickets[0].token_data_id,
                recipient: buyer.accountAddress,
            });

            committedTxn = await aptos.signAndSubmitTransaction({ signer: organizer, transaction: transferTicketTxn });
            await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

            console.log(`🎟 Ticket transferred to User ${i + 1}.`);
        } else {
            console.error(`❌ Error: Organizer has no tickets left to sell.`);
        }
    }

    // Print balances after initial sales
    console.log("💰 Balances after ticket purchases:");
    await printBalances([
        { name: "Organizer", account: organizer },
        ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
    ]);

    // Users resell tickets with royalties
    console.log("🔄 Users are reselling tickets with royalties...");

    // User 1 sells their ticket to User 2
    const seller = users[0];
    const buyer = users[1];
    const resalePrice = TICKET_PRICE;
    const royaltyAmount = (resalePrice * ROYALTY_PERCENTAGE) / 100;

    console.log(`💰 User 1 is selling their ticket to User 2 with ${ROYALTY_PERCENTAGE}% royalty to Organizer.`);

    // Payment from buyer to seller
    const resellPaymentTxn = await aptos.transaction.build.simple({
        sender: buyer.accountAddress,
        data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [seller.accountAddress, resalePrice - royaltyAmount],
        },
    });
    committedTxn = await aptos.signAndSubmitTransaction({ signer: buyer, transaction: resellPaymentTxn });
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    // Payment from buyer to organizer as royalty
    const royaltyTxn = await aptos.transaction.build.simple({
        sender: buyer.accountAddress,
        data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [organizer.accountAddress, royaltyAmount],
        },
    });
    committedTxn = await aptos.signAndSubmitTransaction({ signer: buyer, transaction: royaltyTxn });
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    console.log(`✅ Royalty of ${royaltyAmount / 100_000_000} APT paid to Organizer.`);

    // Transfer the NFT ticket from User 1 to User 2
    const sellerTickets = await aptos.getOwnedDigitalAssets({ ownerAddress: seller.accountAddress });

    if (sellerTickets.length > 0) {
        const resellTransferTxn = await aptos.transferDigitalAssetTransaction({
            sender: seller,
            digitalAssetAddress: sellerTickets[0].token_data_id,
            recipient: buyer.accountAddress,
        });

        committedTxn = await aptos.signAndSubmitTransaction({ signer: seller, transaction: resellTransferTxn });
        await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

        console.log(`🎟 Ticket successfully transferred from User 1 to User 2 with royalty paid.`);
    } else {
        console.error("❌ Error: User 1 does not have any tickets to sell.");
    }

    // Final balances after resale
    console.log("💰 Final Balances:");
    await printBalances([
        { name: "Organizer", account: organizer },
        ...users.map((user, index) => ({ name: `User ${index + 1}`, account: user })),
    ]);
};

ticketingSystem();
