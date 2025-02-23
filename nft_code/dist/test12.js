var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { Account, Aptos, AptosConfig, Network, NetworkToNetworkName } from "@aptos-labs/ts-sdk";
const ALICE_INITIAL_BALANCE = 100000000;
const BOB_INITIAL_BALANCE = 0;
const TRANSFER_AMOUNT = 1000000;
// Set up the client
const APTOS_NETWORK = NetworkToNetworkName[(_a = process.env.APTOS_NETWORK) !== null && _a !== void 0 ? _a : Network.DEVNET];
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);
/**
 * Prints the balance of an account
 * @param name
 * @param accountAddress
 * @param versionToWaitFor
 * @returns {Promise<number>}
 *
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
    console.log("This example will create two accounts (Alice and Bob), fund Alice, and transfer between them using transferCoinTransaction.");
    // Create two accounts
    const alice = Account.generate();
    const bob = Account.generate();
    console.log("=== Addresses ===\n");
    console.log(`Alice's address is: ${alice.accountAddress}`);
    console.log(`Bob's address is: ${bob.accountAddress}`);
    // Fund the accounts
    console.log("\n=== Funding accounts ===\n");
    // Fund alice account
    yield aptos.fundAccount({
        accountAddress: alice.accountAddress,
        amount: ALICE_INITIAL_BALANCE,
    });
    // Show the balances
    console.log("\n=== Initial Balances ===\n");
    const aliceBalance = yield balance("Alice", alice.accountAddress);
    const bobBalance = yield balance("Bob", bob.accountAddress);
    if (aliceBalance !== ALICE_INITIAL_BALANCE)
        throw new Error("Alice's balance is incorrect");
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
    if (newAliceBalance >= ALICE_INITIAL_BALANCE - TRANSFER_AMOUNT)
        throw new Error("Alice's balance after transfer is incorrect");
});
example();
