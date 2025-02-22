module 0x712126eae6719d5eec155ecbbdca24138926cef127d4d5b9aaa8642acce200fd::event_ticketing {

    use std::string;
    use std::signer;
    use aptos_token::token;

    struct Ticket has key, store {
        name: string::String,
        description: string::String,
        uri: string::String,
        price: u64,
        royalty_percentage: u64,
        owner: address,
        creator: address,
    }


    // Resource to store ticket configuration and counters
    struct TicketConfig has key {
        total_tickets: u64, // Total tickets generated so far
        max_tickets: u64,  // Maximum tickets allowed
    }


    // Initialize the ticket configuration
    public entry fun initialize_ticket_config(creator: &signer, max_tickets: u64) {
        let creator_addr = signer::address_of(creator);
        assert!(!exists<TicketConfig>(creator_addr), 0); // Ensure config doesn't already exist

        // Create and publish the TicketConfig resource
        move_to(creator, TicketConfig {
            total_tickets: 0,
            max_tickets,
        });
    }

    public entry fun create_ticket(
        creator: &signer,
        name: string::String,
        description: string::String,
        uri: string::String,
        price: u64,
        royalty_percentage: u64
    ) {
        let creator_addr = signer::address_of(creator);

        // Ensure the TicketConfig resource exists
        assert!(exists<TicketConfig>(creator_addr), 1); // Error code 1: Config not initialized

        // Get the TicketConfig resource
        let ticket_config = borrow_global_mut<TicketConfig>(creator_addr);

        // Check if the maximum ticket limit has been reached
        assert!(ticket_config.total_tickets < ticket_config.max_tickets, 2); // Error code 2: Max tickets reached

        // Create a collection (if not already created)
        token::create_collection(
            creator,
            string::utf8(b"Event Tickets"), // Collection name
            string::utf8(b"Tickets for events"), // Collection description
            uri, // Collection URI
            1, // Maximum tokens in the collection (1 for unique tickets)
            vector[false], // Mutability flags
        );

        // Mint a token within the collection
        let token_id = token::mint_token(
            creator,
            string::utf8(b"Event Tickets"), // Collection name
            name, // Token name
        );

        // Store ticket information
        move_to(creator, Ticket {
            name,
            description,
            uri,
            price,
            royalty_percentage,
            owner: creator_addr,
            creator: creator_addr,
        });

        // Increment the total tickets counter
        ticket_config.total_tickets = ticket_config.total_tickets + 1;
    }

    public entry fun transfer_ticket(
        sender: &signer,
        recipient: address,
        token_id: token::TokenId // Use TokenId instead of address
    ) {
        token::transfer(sender, recipient, token_id, 1);
    }
}