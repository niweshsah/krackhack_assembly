"use strict";
// import React, { useState } from "react";
// import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { Button, notification } from "antd";
// // Aptos Config for Devnet
// const APTOS_NETWORK = Network.DEVNET;
// const config = new AptosConfig({ network: APTOS_NETWORK });
// const aptos = new Aptos(config);
// const TRANSFER_AMOUNT = 1_000_000;
// const WalletTransfer = () => {
//   const { account, connect, signAndSubmitTransaction, disconnect } = useWallet();
//   const [isTransferring, setIsTransferring] = useState(false);
//   const handleTransfer = async () => {
//     if (!account) {
//       notification.error({ message: "Please connect your wallet first!" });
//       return;
//     }
//     try {
//       setIsTransferring(true);
//       const bob = Aptos.generateAccount(); // Generate a new Bob account
//       console.log(`Sender Address (Alice): ${account.address}`);
//       console.log(`Recipient Address (Bob): ${bob.accountAddress}`);
//       const transaction = {
//         sender: account.address,
//         recipient: bob.accountAddress,
//         amount: TRANSFER_AMOUNT,
//       };
//       // Wallet prompts the user for approval
//       const pendingTxn = await signAndSubmitTransaction(transaction);
//       // Wait for transaction confirmation
//       const response = await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
//       notification.success({
//         message: "Transaction Successful",
//         description: `Txn Hash: ${response.hash}`,
//       });
//       console.log(`Transaction Confirmed: ${response.hash}`);
//     } catch (error) {
//       notification.error({ message: "Transaction Failed", description: error.message });
//       console.error("Transaction error:", error);
//     } finally {
//       setIsTransferring(false);
//     }
//   };
//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Aptos Wallet Transfer</h2>
//       {!account ? (
//         <Button type="primary" onClick={() => connect("petra")}>
//           Connect Wallet
//         </Button>
//       ) : (
//         <>
//           <p>Connected: {account.address}</p>
//           <Button type="primary" onClick={handleTransfer} loading={isTransferring}>
//             Transfer {TRANSFER_AMOUNT} APT to Bob
//           </Button>
//           <Button style={{ marginLeft: 10 }} danger onClick={disconnect}>
//             Disconnect Wallet
//           </Button>
//         </>
//       )}
//     </div>
//   );
// };
// export default WalletTransfer;
