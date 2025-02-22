import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const INITIAL_BALANCE = 100_000_000; // 1 APT
const TICKET_PRICE = 5_000_000; // 0.05 APT (5M Octas)
const APTOS_NETWORK = Network.DEVNET;

// Use your actual Move module address
const MODULE_ADDRESS = "0x712126eae6719d5eec155ecbbdca24138926cef127d4d5b9aaa8642acce200fd";
const FUNCTION_CREATE_TICKET = `${MODULE_ADDRESS}::event_ticketing::create_ticket`;
const FUNCTION_TRANSFER_TICKET = `${MODULE_ADDRESS}::event_ticketing::transfer_ticket`;

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const ticketingSystem = async () => {
    console.log("🎟 NFT Ticketing System with Royalties on Resale\n");

    const organizer = Account.generate();
    const user1 = Account.generate();
    const user2 = Account.generate();

    console.log(`Organizer: ${organizer.accountAddress}`);
    console.log(`User 1: ${user1.accountAddress}`);
    console.log(`User 2: ${user2.accountAddress}\n`);

    // Fund accounts
    await aptos.fundAccount({ accountAddress: organizer.accountAddress, amount: INITIAL_BALANCE });
    await aptos.fundAccount({ accountAddress: user1.accountAddress, amount: INITIAL_BALANCE });
    await aptos.fundAccount({ accountAddress: user2.accountAddress, amount: INITIAL_BALANCE });

    // Mint ticket NFT with royalties
    console.log(`✅ Minting NFT Ticket...\n`);
    const createTicketTxn = await aptos.transaction.build.simple({
        sender: organizer.accountAddress,
        data: {
            function: FUNCTION_CREATE_TICKET,
            functionArguments: [
                "VIP Ticket #1",
                "Exclusive VIP event access",
                "https://example.com/ticket.png",
                TICKET_PRICE,
                10, // 10% royalty
            ],
        },
    });
    await aptos.signAndSubmitTransaction({ signer: organizer, transaction: createTicketTxn });

    console.log(`🎟 NFT Ticket Minted Successfully!\n`);

    // Transfer ticket to User 1
    console.log("📤 Transferring ticket to User 1...\n");
    const transferTxn = await aptos.transaction.build.simple({
        sender: organizer.accountAddress,
        data: {
            function: FUNCTION_TRANSFER_TICKET,
            functionArguments: [
                user1.accountAddress,
                organizer.accountAddress, // NFT's unique ID/address
            ],
        },
    });
    await aptos.signAndSubmitTransaction({ signer: organizer, transaction: transferTxn });

    console.log("✅ Ticket successfully transferred to User 1!\n");

    // User 1 resells ticket to User 2 (handling royalty)
    console.log("🔄 User 1 is reselling ticket to User 2...\n");

    const royaltyAmount = TICKET_PRICE * 0.10;
    const sellerAmount = TICKET_PRICE - royaltyAmount;

    // Buyer (User 2) pays User 1
    const paymentTxn = await aptos.transaction.build.simple({
        sender: user2.accountAddress,
        data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [user1.accountAddress, sellerAmount],
        },
    });
    await aptos.signAndSubmitTransaction({ signer: user2, transaction: paymentTxn });

    // Buyer (User 2) pays royalty to Organizer
    const royaltyTxn = await aptos.transaction.build.simple({
        sender: user2.accountAddress,
        data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [organizer.accountAddress, royaltyAmount],
        },
    });
    await aptos.signAndSubmitTransaction({ signer: user2, transaction: royaltyTxn });

    // Transfer NFT to User 2
    console.log("📤 Transferring ticket from User 1 to User 2...\n");
    const resellTransferTxn = await aptos.transaction.build.simple({
        sender: user1.accountAddress,
        data: {
            function: FUNCTION_TRANSFER_TICKET,
            functionArguments: [
                user2.accountAddress,
                user1.accountAddress, // NFT's unique ID/address
            ],
        },
    });
    await aptos.signAndSubmitTransaction({ signer: user1, transaction: resellTransferTxn });

    console.log("🎟 Ticket successfully transferred from User 1 to User 2 with royalties paid!\n");
};

ticketingSystem();
