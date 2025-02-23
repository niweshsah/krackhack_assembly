// import {
//     Account,
//     AccountAddress,
//     Aptos,
//     AptosConfig,
//     Network,
//     Ed25519PrivateKey,
//   } from "@aptos-labs/ts-sdk";
  
//   // Your private key in hexadecimal format
//   const ALICE_ADDRESS_HEX = "0xa53709fb9b81a068f5c4868c62c2513463411995184fb00a7e3c6166b58c9cd1";
  
//   // Convert hex private key to Uint8Array
//   const alicePrivateKeyBytes = new Uint8Array(
//     ALICE_ADDRESS_HEX.replace(/^0x/, "")
//       .match(/.{1,2}/g)!
//       .map(byte => parseInt(byte, 16))
//   );

  
  
//   const ALICE_INITIAL_BALANCE = 100_000_000;
//   const BOB_INITIAL_BALANCE = 0;
//   const TRANSFER_AMOUNT = 1_000_000;
  
//   // Set up the client for Testnet
// //   const APTOS_NETWORK: Network = Network.TESTNET;
//   const APTOS_NETWORK = Network.DEVNET;

//   const config = new AptosConfig({ network: APTOS_NETWORK });
//   const aptos = new Aptos(config);
  
//   // Create Alice's account from a private key
// //   const alicePrivateKey = new Ed25519PrivateKey(alicePrivateKeyBytes);
// //   const alice = Account.fromPrivateKey({ privateKey: alicePrivateKey });
  
//   // Create Bob's account
//   const bob = Account.generate();
  
//   console.log("=== Addresses ===\n");
//   console.log(`Alice's address is: ${alicePrivateKeyBytes}`);
//   console.log(`Bob's address is: ${bob.accountAddress}`);


//   const sellerTickets = await aptos.getOwnedDigitalAssets({
//     ownerAddress: alicePrivateKeyBytes,
// });

  
//   /**
//    * Prints the balance of an account
//    * @param name
//    * @param accountAddress
//    * @param versionToWaitFor
//    * @returns {Promise<number>}
//    */
//   const balance = async (name: string, accountAddress: AccountAddress, versionToWaitFor?: bigint): Promise<number> => {
//     const amount = await aptos.getAccountAPTAmount({
//       accountAddress,
//       minimumLedgerVersion: versionToWaitFor,
//     });
//     console.log(`${name}'s balance is: ${amount}`);
//     return amount;
//   };
  
//   const example = async () => {
//     console.log("Using Alice's private key, funding Alice, and transferring to Bob on Testnet.");
  
//     // Fund Alice's account
//     console.log("\n=== Funding accounts ===\n");
//     // await aptos.fundAccount({
//     //   accountAddress: alice.accountAddress,
//     //   amount: ALICE_INITIAL_BALANCE,
//     // });
  
//     // Show the balances
//     console.log("\n=== Initial Balances ===\n");
//     const aliceBalance = await balance("Alice", alice.accountAddress);
//     const bobBalance = await balance("Bob", bob.accountAddress);
  
//     // if (aliceBalance !== ALICE_INITIAL_BALANCE) throw new Error("Alice's balance is incorrect");
//     if (bobBalance !== BOB_INITIAL_BALANCE) throw new Error("Bob's balance is incorrect");
  
//     // Transfer between users
//     console.log(`\n=== Transfer ${TRANSFER_AMOUNT} from Alice to Bob ===\n`);
//     const transaction = await aptos.transferCoinTransaction({
//       sender: alice.accountAddress,
//       recipient: bob.accountAddress,
//       amount: TRANSFER_AMOUNT,
//     });
//     const pendingTxn = await aptos.signAndSubmitTransaction({ signer: alice, transaction });
//     const response = await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
//     console.log(`Committed transaction: ${response.hash}`);
  
//     console.log("\n=== Balances after transfer ===\n");
//     const newAliceBalance = await balance("Alice", alice.accountAddress, BigInt(response.version));
//     const newBobBalance = await balance("Bob", bob.accountAddress);
  
//     // Bob should have the transfer amount
//     if (newBobBalance !== TRANSFER_AMOUNT + BOB_INITIAL_BALANCE)
//       throw new Error("Bob's balance after transfer is incorrect");
  
//     // Alice should have the remainder minus gas
//     // if (newAliceBalance >= ALICE_INITIAL_BALANCE - TRANSFER_AMOUNT)
//     //   throw new Error("Alice's balance after transfer is incorrect");
//   };
  
//   example();

















import {
    Account,
    AccountAddress,
    Aptos,
    AptosConfig,
    Network,
    Ed25519PrivateKey,

} from "@aptos-labs/ts-sdk";

// Alice's address 
const ALICE_ADDRESS_HEX = "0xa53709fb9b81a068f5c4868c62c2513463411995184fb00a7e3c6166b58c9cd1";

// const ALICE_ADDRESS_HEX = "0xb5f96a6656d1b7353ea188666db490bdd9091ae7a987a75432e8c742c1995253";
// const ALICE_ADDRESS_HEX = "0x3e6d013285fe67aec5b7c757498378f31f1b188ff1796488baf0a1e88640edf0";



// Set up the client for Devnet
const APTOS_NETWORK = Network.TESTNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const checkAssets = async () => {
    try {
        console.log("Fetching assets for Alice...");

        // Convert address from string to AccountAddress
        // const aliceAddress = AccountAddress.fromString(ALICE_ADDRESS_HEX);

        const backendPrivateKey = new Ed25519PrivateKey("0x7d90b6baf67a4f6e8a9194df96ca1115ce8dfae22b1e980d81e01ac798c2056d");
        const backend = Account.fromPrivateKey({ privateKey: backendPrivateKey });



        console.log("address: ",backend.accountAddress);

        // Fetch Alice's digital assets
        const sellerTickets = await aptos.getOwnedDigitalAssets({
            ownerAddress: backend.accountAddress,
        });

        console.log("seller: ",sellerTickets );

        console.log(`Alice owns ${sellerTickets.length} assets.`);
        // console.log(sellerTickets);
    } catch (error) {
        console.error("Error fetching assets:", error);
    }
};

checkAssets();

  