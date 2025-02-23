var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey, } from "@aptos-labs/ts-sdk";
// Your private key in hexadecimal format
const ALICE_PRIVATE_KEY_HEX = "0x02fbd459d84108d921fe6ac1d30cb6b1404b95fabbc4ac25eb45313bb069ad00";
// Convert hex private key to Uint8Array
const alicePrivateKeyBytes = new Uint8Array(ALICE_PRIVATE_KEY_HEX.replace(/^0x/, "")
    .match(/.{1,2}/g)
    .map(byte => parseInt(byte, 16)));
const ALICE_INITIAL_BALANCE = 100000000;
const BOB_INITIAL_BALANCE = 0;
const TRANSFER_AMOUNT = 1000000;
// Set up the client for Testnet
//   const APTOS_NETWORK: Network = Network.TESTNET;
const APTOS_NETWORK = Network.DEVNET;
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
const balance = (name, accountAddress, versionToWaitFor) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = yield aptos.getAccountAPTAmount({
        accountAddress,
        minimumLedgerVersion: versionToWaitFor,
    });
    console.log(`${name}'s balance is: ${amount}`);
    return amount;
});
const example = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Using Alice's private key, funding Alice, and transferring to Bob on Testnet.");
    // Fund Alice's account
    console.log("\n=== Funding accounts ===\n");
    // await aptos.fundAccount({
    //   accountAddress: alice.accountAddress,
    //   amount: ALICE_INITIAL_BALANCE,
    // });
    // Show the balances
    console.log("\n=== Initial Balances ===\n");
    const aliceBalance = yield balance("Alice", alice.accountAddress);
    const bobBalance = yield balance("Bob", bob.accountAddress);
    // if (aliceBalance !== ALICE_INITIAL_BALANCE) throw new Error("Alice's balance is incorrect");
    if (bobBalance !== BOB_INITIAL_BALANCE)
        throw new Error("Bob's balance is incorrect");
    // Transfer between users
    console.log(`\n=== Transfer ${TRANSFER_AMOUNT} from Alice to Bob ===\n`);
    const transaction = yield aptos.transferCoinTransaction({
        sender: alice.accountAddress,
        recipient: bob.accountAddress,
        amount: TRANSFER_AMOUNT,
    });
    const pendingTxn = yield aptos.signAndSubmitTransaction({ signer: alice, transaction });
    const response = yield aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
    console.log(`Committed transaction: ${response.hash}`);
    console.log("\n=== Balances after transfer ===\n");
    const newAliceBalance = yield balance("Alice", alice.accountAddress, BigInt(response.version));
    const newBobBalance = yield balance("Bob", bob.accountAddress);
    // Bob should have the transfer amount
    if (newBobBalance !== TRANSFER_AMOUNT + BOB_INITIAL_BALANCE)
        throw new Error("Bob's balance after transfer is incorrect");
    // Alice should have the remainder minus gas
    // if (newAliceBalance >= ALICE_INITIAL_BALANCE - TRANSFER_AMOUNT)
    //   throw new Error("Alice's balance after transfer is incorrect");
});
example();
