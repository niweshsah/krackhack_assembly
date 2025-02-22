"use strict";
// /**
//  * This example shows how to use the Aptos client to create accounts, fund them, and transfer between them.
//  */
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
// import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
// const COIN_STORE = `0x1::coin::CoinStore<${APTOS_COIN}>`;
// const ALICE_INITIAL_BALANCE = 100_000_000;
// const BOB_INITIAL_BALANCE = 100;
// const TRANSFER_AMOUNT = 100;
// async function example() {
//   console.log(
//     "This example will create two accounts (Alice and Bob), fund them, and transfer between them.",
//   );
//   // Setup the client
//   // Devnet is the test network for Aptos
//   const config = new AptosConfig({ network: Network.DEVNET });
//   const aptos = new Aptos(config);
//   // Generate two account credentials
//   // Each account has a private key, a public key, and an address
//   const alice = Account.generate();
//   const bob = Account.generate();
//   console.log("=== Addresses ===\n");
//   console.log(`Alice's address is: ${alice.accountAddress}`);
//   console.log(`Bob's address is: ${bob.accountAddress}`);
// //   A faucet is a service that provides free test tokens on test networks like Devnet or Testnet.
//   // Fund the accounts using a faucet
//   console.log("\n=== Funding accounts ===\n");
//   await aptos.fundAccount({
//     accountAddress: alice.accountAddress,
//     amount: ALICE_INITIAL_BALANCE,
//   });
//   await aptos.fundAccount({
//     accountAddress: bob.accountAddress,
//     amount: BOB_INITIAL_BALANCE,
//   });
//   console.log("Alice and Bob's accounts have been funded!");
//   // Look up the newly funded account's balances
//   console.log("\n=== Balances ===\n");
//   const aliceAccountBalance = await aptos.getAccountResource({
//     accountAddress: alice.accountAddress,
//     resourceType: COIN_STORE,
//   });
//   const aliceBalance = Number(aliceAccountBalance.coin.value);
//   console.log(`Alice's balance is: ${aliceBalance}`);
//   const bobAccountBalance = await aptos.getAccountResource({
//     accountAddress: bob.accountAddress,
//     resourceType: COIN_STORE,
//   });
//   const bobBalance = Number(bobAccountBalance.coin.value);
//   console.log(`Bob's balance is: ${bobBalance}`);
//   // Send a transaction from Alice's account to Bob's account
//   const txn = await aptos.transaction.build.simple({
//     sender: alice.accountAddress,
//     data: {
//       // All transactions on Aptos are implemented via smart contracts.
//       function: "0x1::aptos_account::transfer",
//       functionArguments: [bob.accountAddress, 100],
//     },
//   });
//   console.log("\n=== Transfer transaction ===\n");
//   // Both signs and submits
// //   Signing ensures the transaction is authenticated and authorized by Alice.
//   const committedTxn = await aptos.signAndSubmitTransaction({
//     signer: alice,
//     transaction: txn, // This is the transaction we built above
//   });
//   // Waits for Aptos to verify and execute the transaction
//   const executedTransaction = await aptos.waitForTransaction({
//     transactionHash: committedTxn.hash,
//   });
//   console.log("Transaction hash:", executedTransaction.hash);
//   console.log("\n=== Balances after transfer ===\n");
//   const newAliceAccountBalance = await aptos.getAccountResource({
//     accountAddress: alice.accountAddress,
//     resourceType: COIN_STORE,
//   });
//   const newAliceBalance = Number(newAliceAccountBalance.coin.value);
//   console.log(`Alice's balance is: ${newAliceBalance}`);
//   const newBobAccountBalance = await aptos.getAccountResource({
//     accountAddress: bob.accountAddress,
//     resourceType: COIN_STORE,
//   });
//   const newBobBalance = Number(newBobAccountBalance.coin.value);
//   console.log(`Bob's balance is: ${newBobBalance}`);
//   // Bob should have the transfer amount
//   if (newBobBalance !== TRANSFER_AMOUNT + BOB_INITIAL_BALANCE)
//     throw new Error("Bob's balance after transfer is incorrect");
//   // Alice should have the remainder minus gas
//   if (newAliceBalance >= ALICE_INITIAL_BALANCE - TRANSFER_AMOUNT)
//     throw new Error("Alice's balance after transfer is incorrect");
// }
// example();
// -----------------------------------------------------------------------------------------
// above code is the example of how to use the aptos client to create accounts, fund them, and transfer between them.
// -----------------------------------------------------------------------------------------
// import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// const TICKET_COLLECTION = "EventTickets";
// const TICKET_NAME = "VIP Ticket";
// const TICKET_DESCRIPTION = "Access to the VIP section";
// // const TICKET_URI = "..src/images/a.png"; // NFT image URL
// const TICKET_URI = "https://picsum.photos/id/237/200/300"; // NFT image URL
// async function createNFT() {
//     const config = new AptosConfig({ network: Network.DEVNET });
//     const aptos = new Aptos(config);
//     const eventOrganizer = Account.generate();
//     await aptos.fundAccount({
//         accountAddress: eventOrganizer.accountAddress,
//         amount: 1_000_000_000, // Fund the account with test APT tokens
//     });
//     console.log(`Organizer Address: ${eventOrganizer.accountAddress}`);
//     const createCollectionTxn = await aptos.transaction.build.simple({
//         sender: eventOrganizer.accountAddress,
//         data: {
//             function: "0x3::token::create_collection_script",
//             functionArguments: [
//                 TICKET_COLLECTION,  // Collection name
//                 "Official tickets for the event", // Collection description
//                 "https://picsum.photos/id/227/200/300", // Collection URI
//                 1000, // Max supply
//                 [false, false, false], // Mutability options (can’t update metadata/supply)
//             ],
//         },
//     });
//     await aptos.signAndSubmitTransaction({
//         signer: eventOrganizer,
//         transaction: createCollectionTxn,
//     });
//     console.log("Collection created!");
//     const mintTicketTxn = await aptos.transaction.build.simple({
//       sender: eventOrganizer.accountAddress,
//       data: {
//         function: "0x3::token::create_token_script",
//         functionArguments: [
//           TICKET_COLLECTION, // Collection name
//           TICKET_NAME, // NFT name
//           TICKET_DESCRIPTION,
//           1, // Supply of this NFT
//           TICKET_URI, // Image URL
//           eventOrganizer.accountAddress, // Creator address
//           0, 0, 0, // Royalty settings
//           [false, false, false, false, false], // Mutability options
//           [], [], [], // Property keys and values
//         ],
//       },
//     });
//     await aptos.signAndSubmitTransaction({
//       signer: eventOrganizer,
//       transaction: mintTicketTxn,
//     });
//     console.log("NFT Ticket Minted!");
//     const buyer = Account.generate(); // Buyer account
// await aptos.fundAccount({ 
//   accountAddress: buyer.accountAddress, 
//   amount: 500_000_000, 
// });
// const transferTicketTxn = await aptos.transaction.build.simple({
//   sender: eventOrganizer.accountAddress,
//   data: {
//     function: "0x3::token::transfer_script",
//     functionArguments: [
//       buyer.accountAddress, // Receiver's address
//       eventOrganizer.accountAddress, // Sender's address (ticket owner)
//       TICKET_COLLECTION, // Collection name
//       TICKET_NAME, // NFT name
//       1, // Amount (1 ticket)
//     ],
//   },
// });
// await aptos.signAndSubmitTransaction({
//   signer: eventOrganizer,
//   transaction: transferTicketTxn,
// });
// console.log(`Ticket NFT transferred to: ${buyer.accountAddress}`);
// }
// createNFT();
// Above code is my own code to create NFTs and transfer them to other accounts.
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const INITIAL_BALANCE = 100000000;
// Set up the client
// const APTOS_NETWORK: Network = NetworkToNetworkName[process.env.APTOS_NETWORK] || Network.DEVNET;
const APTOS_NETWORK = ts_sdk_1.Network.DEVNET;
const config = new ts_sdk_1.AptosConfig({ network: APTOS_NETWORK });
const aptos = new ts_sdk_1.Aptos(config);
const example = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("This example will create and fund Alice and Bob, then Alice account will create a collection and a digital asset in that collection and transfer it to Bob.");
    // Create Alice and Bob accounts
    const alice = ts_sdk_1.Account.generate();
    const bob = ts_sdk_1.Account.generate();
    console.log("=== Addresses ===\n");
    console.log(`Alice's address is: ${alice.accountAddress}`);
    // Fund and create the accounts
    yield aptos.fundAccount({
        accountAddress: alice.accountAddress,
        amount: INITIAL_BALANCE,
    });
    yield aptos.fundAccount({
        accountAddress: bob.accountAddress,
        amount: INITIAL_BALANCE,
    });
    const collectionName = "Example Collection";
    const collectionDescription = "Example description.";
    const collectionURI = "aptos.dev";
    // Create the collection
    const createCollectionTransaction = yield aptos.createCollectionTransaction({
        creator: alice,
        description: collectionDescription,
        name: collectionName,
        uri: collectionURI,
    });
    console.log("\n=== Create the collection ===\n");
    let committedTxn = yield aptos.signAndSubmitTransaction({ signer: alice, transaction: createCollectionTransaction });
    let pendingTxn = yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    const aliceCollection = yield aptos.getCollectionData({
        creatorAddress: alice.accountAddress,
        collectionName,
        minimumLedgerVersion: BigInt(pendingTxn.version),
    });
    console.log(`Alice's collection: ${JSON.stringify(aliceCollection, null, 4)}`);
    const tokenName = "Example Asset";
    const tokenDescription = "Example asset description.";
    const tokenURI = "aptos.dev/asset";
    console.log("\n=== Alice Mints the digital asset ===\n");
    const mintTokenTransaction = yield aptos.mintDigitalAssetTransaction({
        creator: alice,
        collection: collectionName,
        description: tokenDescription,
        name: tokenName,
        uri: tokenURI,
    });
    committedTxn = yield aptos.signAndSubmitTransaction({ signer: alice, transaction: mintTokenTransaction });
    pendingTxn = yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    const aliceDigitalAsset = yield aptos.getOwnedDigitalAssets({
        ownerAddress: alice.accountAddress,
        minimumLedgerVersion: BigInt(pendingTxn.version),
    });
    console.log(`Alice's digital assets balance: ${aliceDigitalAsset.length}`);
    console.log(`Alice's digital asset: ${JSON.stringify(aliceDigitalAsset[0], null, 4)}`);
    console.log("\n=== Transfer the digital asset to Bob ===\n");
    const transferTransaction = yield aptos.transferDigitalAssetTransaction({
        sender: alice,
        digitalAssetAddress: aliceDigitalAsset[0].token_data_id,
        recipient: bob.accountAddress,
    });
    committedTxn = yield aptos.signAndSubmitTransaction({ signer: alice, transaction: transferTransaction });
    pendingTxn = yield aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    const aliceDigitalAssetsAfter = yield aptos.getOwnedDigitalAssets({
        ownerAddress: alice.accountAddress,
        minimumLedgerVersion: BigInt(pendingTxn.version),
    });
    console.log(`Alice's digital assets balance: ${aliceDigitalAssetsAfter.length}`);
    const bobDigitalAssetsAfter = yield aptos.getOwnedDigitalAssets({
        ownerAddress: bob.accountAddress,
        minimumLedgerVersion: BigInt(pendingTxn.version),
    });
    console.log(`Bob's digital assets balance: ${bobDigitalAssetsAfter.length}`);
});
example();
