import { TICKETING_CONFIG } from "../config/ticketing.js";
import { InsufficientFundsError, NoTicketsAvailableError, TicketingError } from "../core/errors.js";
export class TicketService {
    client;
    constructor(client) {
        this.client = client;
    }
    async findOwnedTicket(owner, ticketType) {
        const tickets = await this.client.aptos.getOwnedDigitalAssets({
            ownerAddress: owner.accountAddress,
        });
        return tickets.find((ticket) => ticket.current_token_data?.description === ticketType) ?? null;
    }
    async transferTicket(seller, buyer, ticketType) {
        const ticket = await this.findOwnedTicket(seller, ticketType);
        if (!ticket)
            throw new NoTicketsAvailableError(`No ${ticketType} tickets available`);
        const transaction = await this.client.aptos.transferDigitalAssetTransaction({
            sender: seller,
            digitalAssetAddress: ticket.token_data_id,
            recipient: buyer.accountAddress,
        });
        return this.client.submitAndWait(seller, transaction);
    }
    async buyTicket(buyer, seller, ticketType) {
        const price = TICKETING_CONFIG.TICKET_PRICES[ticketType];
        const balance = await this.client.aptos.getAccountAPTAmount({
            accountAddress: buyer.accountAddress,
        });
        if (balance < price)
            throw new InsufficientFundsError();
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
    async resellTicket(seller, buyer, organizer, ticketType, resalePrice) {
        const maximum = TICKETING_CONFIG.MAX_RESALE_PRICES[ticketType];
        if (resalePrice <= 0 || resalePrice > maximum) {
            throw new TicketingError(`Resale price must be between 1 and ${maximum} octas`);
        }
        const royalty = Math.floor((resalePrice * TICKETING_CONFIG.ROYALTY_PERCENTAGE) / 100);
        const sellerAmount = resalePrice - royalty;
        const balance = await this.client.aptos.getAccountAPTAmount({
            accountAddress: buyer.accountAddress,
        });
        if (balance < resalePrice)
            throw new InsufficientFundsError();
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
//# sourceMappingURL=TicketService.js.map