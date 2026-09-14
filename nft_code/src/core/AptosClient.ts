import { Aptos, AptosConfig, Ed25519Account } from "@aptos-labs/ts-sdk";
import { TICKETING_CONFIG } from "../config/ticketing.js";
import { TransactionError } from "./errors.js";

export class AptosClient {
  readonly aptos: Aptos;

  constructor() {
    this.aptos = new Aptos(new AptosConfig({ network: TICKETING_CONFIG.NETWORK }));
  }

  async submitAndWait(signer: Ed25519Account, transaction: any): Promise<string> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= TICKETING_CONFIG.MAX_RETRIES; attempt += 1) {
      try {
        const response = await this.aptos.signAndSubmitTransaction({ signer, transaction });
        await this.waitForTransaction(response.hash);
        return response.hash;
      } catch (error) {
        lastError = error;
        if (attempt < TICKETING_CONFIG.MAX_RETRIES) {
          await this.delay(TICKETING_CONFIG.RETRY_DELAY_MS * attempt);
        }
      }
    }

    throw new TransactionError("Transaction submission failed after retries", lastError);
  }

  private async waitForTransaction(hash: string): Promise<void> {
    for (let attempt = 1; attempt <= TICKETING_CONFIG.MAX_RETRIES; attempt += 1) {
      try {
        await this.aptos.waitForTransaction({ transactionHash: hash });
        return;
      } catch (error) {
        if (attempt === TICKETING_CONFIG.MAX_RETRIES) {
          throw new TransactionError("Transaction confirmation failed", error);
        }
        await this.delay(TICKETING_CONFIG.RETRY_DELAY_MS * attempt);
      }
    }
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
