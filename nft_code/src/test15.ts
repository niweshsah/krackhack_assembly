import {
    Account,
    AccountAddress,
    Aptos,
    AptosConfig,
    Network,
    NetworkToNetworkName,
    Ed25519PrivateKey,
  } from "@aptos-labs/ts-sdk";
  
  const ALICE_INITIAL_BALANCE = 100_000_000;
  const BOB_INITIAL_BALANCE = 0;
  const TRANSFER_AMOUNT = 1_000_000;
  
  // Replace this with your actual private key bytes (Uint8Array or Buffer)
  const alicePrivateKeyBytes = new Uint8Array([
    0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
    0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
  ]);
  
  // Set up the client
  const APTOS_NETWORK: Network = NetworkToNetworkName[process.env.APTOS_NETWORK ?? Network.DEVNET];
  const config = new AptosConfig({ network: APTOS_NETWORK });
  const aptos = new Aptos(config);
  
  // Create Alice's account from a private key
  const alicePrivateKey = new Ed25519PrivateKey(alicePrivateKeyBytes);
  const alice = Account.fromPrivateKey({ privateKey: alicePrivateKey });
  
  // Create Bob's account
  const bob = Account.generate();
  
  console.log("=== Addresses ===\n");
  console.log(`Alice's address is: ${alice.accountAddress}`);
  console.log(`Bob's address is: ${bob.accountAddress}`);
  
  /**
   * Prints the balance of an account
   * @param name
   * @param accountAddress
   * @param versionToWaitFor
   * @returns {Promise<number>}
   */
  const balance = async (name: string, accountAddress: AccountAddress, versionToWaitFor?: bigint): Promise<number> => {
    const amount = await aptos.getAccountAPTAmount({
      accountAddress,
      minimumLedgerVersion: versionToWaitFor,
    });
    console.log(`${name}'s balance is: ${amount}`);
    return amount;
  };
  
  const example = async () => {
    console.log("This example will use Alice's private key, fund Alice, and transfer to Bob.");
  
    // Fund Alice's account
    console.log("\n=== Funding accounts ===\n");
    await aptos.fundAccount({
      accountAddress: alice.accountAddress,
      amount: ALICE_INITIAL_BALANCE,
    });
  
    // Show the balances
    console.log("\n=== Initial Balances ===\n");
    const aliceBalance = await balance("Alice", alice.accountAddress);
    const bobBalance = await balance("Bob", bob.accountAddress);
  
    if (aliceBalance !== ALICE_INITIAL_BALANCE) throw new Error("Alice's balance is incorrect");
    if (bobBalance !== BOB_INITIAL_BALANCE) throw new Error("Bob's balance is incorrect");
  
    // Transfer between users
    console.log(`\n=== Transfer ${TRANSFER_AMOUNT} from Alice to Bob ===\n`);
    const transaction = await aptos.transferCoinTransaction({
      sender: alice.accountAddress,
      recipient: bob.accountAddress,
      amount: TRANSFER_AMOUNT,
    });
    const pendingTxn = await aptos.signAndSubmitTransaction({ signer: alice, transaction });
    const response = await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
    console.log(`Committed transaction: ${response.hash}`);
  
    console.log("\n=== Balances after transfer ===\n");
    const newAliceBalance = await balance("Alice", alice.accountAddress, BigInt(response.version));
    const newBobBalance = await balance("Bob", bob.accountAddress);
  
    // Bob should have the transfer amount
    if (newBobBalance !== TRANSFER_AMOUNT + BOB_INITIAL_BALANCE)
      throw new Error("Bob's balance after transfer is incorrect");
  
    // Alice should have the remainder minus gas
    if (newAliceBalance >= ALICE_INITIAL_BALANCE - TRANSFER_AMOUNT)
      throw new Error("Alice's balance after transfer is incorrect");
  };
  
  example();
  