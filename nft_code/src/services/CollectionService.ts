import { Ed25519Account } from "@aptos-labs/ts-sdk";
import { CollectionInfo, TICKETING_CONFIG, TicketType } from "../config/ticketing.js";
import { AptosClient } from "../core/AptosClient.js";
import { TicketingError } from "../core/errors.js";

export class CollectionService {
  constructor(private readonly client: AptosClient) {}

  async create(creator: Ed25519Account, collection: CollectionInfo): Promise<string> {
    try {
      const transaction = await this.client.aptos.createCollectionTransaction({
        creator,
        description: collection.description,
        name: collection.name,
        uri: collection.uri,
      });
      return this.client.submitAndWait(creator, transaction);
    } catch (error) {
      throw new TicketingError("Failed to create NFT collection", error);
    }
  }

  async mintTickets(
    creator: Ed25519Account,
    collectionName: string,
    ticketName: string,
    ticketURI: string,
    ticketType: TicketType,
    quantity: number
  ): Promise<string[]> {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new TicketingError("Ticket quantity must be a positive integer");
    }

    try {
      const hashes: string[] = [];
      for (let index = 0; index < quantity; index += 1) {
        const transaction = await this.client.aptos.mintDigitalAssetTransaction({
          creator,
          collection: collectionName,
          description: ticketType,
          name: `${ticketName} #${index + 1}`,
          uri: ticketURI,
        });
        hashes.push(await this.client.submitAndWait(creator, transaction));
        if (index < quantity - 1) {
          await new Promise((resolve) => setTimeout(resolve, TICKETING_CONFIG.MINT_DELAY_MS));
        }
      }
      return hashes;
    } catch (error) {
      throw new TicketingError("Failed to mint ticket NFTs", error);
    }
  }
}
