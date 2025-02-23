"use strict";
// Function to convert a hex string to Uint8Array(32)
function hexToUint8Array(hex) {
    // Remove '0x' prefix if present
    if (hex.startsWith("0x")) {
        hex = hex.slice(2);
    }
    if (hex.length !== 64) {
        throw new Error("Invalid hex address length. Expected 64 characters.");
    }
    const bytes = hex.match(/.{1,2}/g);
    if (!bytes) {
        throw new Error("Invalid hex string.");
    }
    return new Uint8Array(bytes.map(byte => parseInt(byte, 16)));
}
// Example Aptos wallet address (Hex with 0x prefix)
const hexAddress = "0x1426c457860ebd8c6c0c44badb7ae472b1550375df655d47fe1a95b80fab347e";
// Convert Hex to Uint8Array(32)
const organiserAccountAddress = hexToUint8Array(hexAddress);
// Create Organizer object
const organizer = {
    name: "John Doe",
    email: "john.doe@example.com",
    event: "Tech Conference 2025",
    accountAddress: organiserAccountAddress
};
// Print the organizer object
console.log("Organizer Object:", organizer);
