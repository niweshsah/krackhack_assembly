import { Account, Ed25519Account } from "@aptos-labs/ts-sdk";
import { AccountInfo, TICKETING_CONFIG } from "../config/ticketing.js";
import { AptosClient } from "../core/AptosClient.js";
import { TicketingError } from "../core/errors.js";

export class AccountService {
  constructor(private readonly client: AptosClient) {}

  createAccounts(count: number): Ed25519Account[] {
    if (!Number.isInteger(count) || count < 1) {
      throw new TicketingError("Account count must be a positive integer");
    }
    return Array.from({ length: count }, () => Account.generate());
  }

  async fundAccounts(accounts: Ed25519Account[], amount = TICKETING_CONFIG.INITIAL_BALANCE): Promise<void> {
    for (const account of accounts) {
      await this.client.aptos.fundAccount({ accountAddress: account.accountAddress, amount });
    }
  }

  async getBalances(accounts: AccountInfo[]): Promise<Record<string, number>> {
    const balances: Record<string, number> = {};
    for (const { name, account } of accounts) {
      balances[name] = await this.client.aptos.getAccountAPTAmount({
        accountAddress: account.accountAddress,
      });
    }
    return balances;
  }
}
