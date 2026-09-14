import { Account } from "@aptos-labs/ts-sdk";
import { AccountService } from "./services/AccountService.js";
import { CollectionService } from "./services/CollectionService.js";
import { AptosClient } from "./core/AptosClient.js";
import { TicketService } from "./services/TicketService.js";
const runDemo = process.argv.includes("--demo");
async function main() {
    const client = new AptosClient();
    const accounts = new AccountService(client);
    const collections = new CollectionService(client);
    const tickets = new TicketService(client);
    const organizer = Account.generate();
    const buyer = Account.generate();
    if (!runDemo) {
        console.log("TicketChain NFT toolkit is ready.");
        console.log("Network:", "testnet");
        console.log("Organizer:", organizer.accountAddress.toString());
        console.log("Buyer:", buyer.accountAddress.toString());
        console.log("Run `npm run demo` to execute the Aptos testnet flow.");
        return;
    }
    await accounts.fundAccounts([organizer, buyer]);
    await collections.create(organizer, {
        name: "TicketChain Main Event",
        uri: "https://example.com/tickets",
        description: "Official event tickets for the TicketChain platform.",
    });
    await collections.mintTickets(organizer, "TicketChain Main Event", "Main Event Ticket", "https://example.com/ticket-metadata", "VIP", 2);
    await tickets.buyTicket(buyer, organizer, "VIP");
    console.log("TicketChain NFT demo completed successfully.");
}
main().catch((error) => {
    console.error("NFT flow failed:", error);
    process.exitCode = 1;
});
//# sourceMappingURL=main.js.map