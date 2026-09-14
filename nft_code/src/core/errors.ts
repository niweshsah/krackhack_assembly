export class TicketingError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
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
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "TransactionError";
  }
}
