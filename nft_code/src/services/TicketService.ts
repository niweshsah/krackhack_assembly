import { Ed25519Account } from "@aptos-labs/ts-sdk";
import { TICKETING_CONFIG, TicketType } from "../config/ticketing.js";
import { AptosClient } from "../core/AptosClient.js";
import { InsufficientFundsError, NoTicketsAvailableError, TicketingError } from "../core/errors.js";

export class TicketService {
  constructor(private readonly client: AptosClient) {}

  async findOwnedTicket(owner: Ed25519Account, ticketType: TicketType) {
    const tickets = await this.client.aptos.getOwnedDigitalAssets({
      ownerAddress: owner.accountAddress,
    });
    return tickets.find((ticket) => ticket.current_token_data?.description === ticketType) ?? null;
  }

  async transferTicket(
    seller: Ed25519Account,
    buyer: Ed25519Account,
    ticketType: TicketType
  ): Promise<string> {
    const ticket = await this.findOwnedTicket(seller, ticketType);
    if (!ticket) throw new NoTicketsAvailableError(`No ${ticketType} tickets available`);

    const transaction = await this.client.aptos.transferDigitalAssetTransaction({
      sender: seller,
      digitalAssetAddress: ticket.token_data_id,
      recipient: buyer.accountAddress,
    });
    return this.client.submitAndWait(seller, transaction);
  }

  async buyTicket(buyer: Ed25519Account, seller: Ed25519Account, ticketType: TicketType): Promise<string> {
    const price = TICKETING_CONFIG.TICKET_PRICES[ticketType];
    const balance = await this.client.aptos.getAccountAPTAmount({
      accountAddress: buyer.accountAddress,
    });
    if (balance < price) throw new InsufficientFundsError();

    const payment = await this.client.aptos.transaction.build.simple({
      sender: buyer.accountAddress,
      data: {
        function: "0x1::aptos_account::transfer",
        functionArguments: [seller.accountAddress, price],
      },
    });
    await this.client.submitAndWait(buyer, payment);
    return this.transferTicket(seller, buyer, ticketType);
  }

  async resellTicket(
    seller: Ed25519Account,
    buyer: Ed25519Account,
    organizer: Ed25519Account,
    ticketType: TicketType,
    resalePrice: number
  ): Promise<{ transferHash: string; sellerPaymentHash: string; royaltyHash: string }> {
    const maximum = TICKETING_CONFIG.MAX_RESALE_PRICES[ticketType];
    if (resalePrice <= 0 || resalePrice > maximum) {
      throw new TicketingError(`Resale price must be between 1 and ${maximum} octas`);
    }

    const royalty = Math.floor((resalePrice * TICKETING_CONFIG.ROYALTY_PERCENTAGE) / 100);
    const sellerAmount = resalePrice - royalty;
    const balance = await this.client.aptos.getAccountAPTAmount({
      accountAddress: buyer.accountAddress,
    });
    if (balance < resalePrice) throw new InsufficientFundsError();

    const sellerPayment = await this.client.aptos.transaction.build.simple({
      sender: buyer.accountAddress,
      data: {
        function: "0x1::aptos_account::transfer",
        functionArguments: [seller.accountAddress, sellerAmount],
      },
    });
    const sellerPaymentHash = await this.client.submitAndWait(buyer, sellerPayment);

    const royaltyPayment = await this.client.aptos.transaction.build.simple({
      sender: buyer.accountAddress,
      data: {
        function: "0x1::aptos_account::transfer",
        functionArguments: [organizer.accountAddress, royalty],
      },
    });
    const royaltyHash = await this.client.submitAndWait(buyer, royaltyPayment);
    const transferHash = await this.transferTicket(seller, buyer, ticketType);

    return { transferHash, sellerPaymentHash, royaltyHash };
  }
}
