import { Network } from "@aptos-labs/ts-sdk";
export const TICKETING_CONFIG = {
    NETWORK: Network.TESTNET,
    INITIAL_BALANCE: 100_000_000,
    TICKET_PRICES: {
        VIP: 10_000_000,
        NORMAL: 5_000_000,
    },
    MAX_RESALE_PRICES: {
        VIP: 15_000_000,
        NORMAL: 8_000_000,
    },
    ROYALTY_PERCENTAGE: 10,
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000,
    MINT_DELAY_MS: 1000,
};
//# sourceMappingURL=ticketing.js.map