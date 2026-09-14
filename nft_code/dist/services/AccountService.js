import { Account } from "@aptos-labs/ts-sdk";
import { TICKETING_CONFIG } from "../config/ticketing.js";
import { TicketingError } from "../core/errors.js";
export class AccountService {
    client;
    constructor(client) {
        this.client = client;
    }
    createAccounts(count) {
        if (!Number.isInteger(count) || count < 1) {
            throw new TicketingError("Account count must be a positive integer");
        }
        return Array.from({ length: count }, () => Account.generate());
    }
    async fundAccounts(accounts, amount = TICKETING_CONFIG.INITIAL_BALANCE) {
        for (const account of accounts) {
            await this.client.aptos.fundAccount({ accountAddress: account.accountAddress, amount });
        }
    }
    async getBalances(accounts) {
        const balances = {};
        for (const { name, account } of accounts) {
            balances[name] = await this.client.aptos.getAccountAPTAmount({
                accountAddress: account.accountAddress,
            });
        }
        return balances;
    }
}
//# sourceMappingURL=AccountService.js.map