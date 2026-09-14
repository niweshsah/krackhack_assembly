export class TicketingError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = "TicketingError";
    }
}
export class InsufficientFundsError extends TicketingError {
    constructor(message = "Insufficient funds for transaction") {
        super(message);
        this.name = "InsufficientFundsError";
    }
}
export class NoTicketsAvailableError extends TicketingError {
    constructor(message = "No tickets available") {
        super(message);
        this.name = "NoTicketsAvailableError";
    }
}
export class TransactionError extends TicketingError {
    constructor(message, cause) {
        super(message, cause);
        this.name = "TransactionError";
    }
}
//# sourceMappingURL=errors.js.map