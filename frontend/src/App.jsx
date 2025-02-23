import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import EventListing from './Events';
import EventCreationForm from './CreateEvent';
import ProfileDashboard from './ProfilePage';
import SignInWindow from './SignIn';
import SignUpWindow from './SignUp';
import React, { useState, useEffect } from 'react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { useSelector } from 'react-redux';
import { TicketingSystem } from '../../nft_code/dist/main_nft_export';

function App() {
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [collectionCreated, setCollectionCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Wallet Address:", walletAddress);
  }, [walletAddress]);

  const petraWallet = new PetraWallet();
  
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await petraWallet.connect();
      setWallet(petraWallet);
      setIsConnected(true);

      const account = await petraWallet.account();
      setWalletAddress(account.address);

      setIsLoading(false);
      createCollection()
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setError("Failed to connect wallet. Please try again.");
      setIsConnected(false);
      setIsLoading(false);
    }
  };

  const createCollection = async () => {
    if (!petraWallet || !isConnected) {
      setError("Please connect your wallet first");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add delay to ensure proper transaction initialization
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // const collectionPayload = {
      //   type: "entry_function_payload",
      //   function: "0x3::token::create_collection_script",
      //   arguments: [
      //     "krackhack1", // Keep name consistent
      //     "This is my first NFT collection",
      //     "https://example.com/image.png",
      //     1000,
      //     [false, false, false]
      //   ],
      //   type_arguments: [],
      // };

      // const response = await petraWallet.signAndSubmitTransaction(collectionPayload);
      // console.log("Collection Created:", response);

      // Wait for transaction confirmation
      // await new Promise(resolve => setTimeout(resolve, 2000));

      // setCollectionCreated(true);
      // setIsLoading(false);
      createNFT()
      return true;
    } catch (error) {
      console.error("Failed to create collection:", error);
      setError("Failed to create collection. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const createNFT = async () => {
    if (!petraWallet || !isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const account = await petraWallet.account();
      console.log("account: ", account);

      // Simplified payload with minimal required parameters
      const nftPayload = {
        type: "entry_function_payload",
        function: "0x3::token::create_token_script",
        arguments: [
          "krackhack1",                           // collection name
          "ticket2",                 // token name
          "VIP",        // description
          "1",                            // supply (as string)
          "1",                            // maximum (as string)
          "https://example.com/nft.json", // uri
          account.address,                // royalty payee address
          "100",                          // royalty points denominator (as string)
          "5",                            // royalty points numerator (as string)
          [false, false, false, false, false],  // token mutate config
          [],                             // property keys (empty for now)
          [],                             // property values (empty for now)
          [],                             // property types (empty for now)
        ],
        type_arguments: []
      };

      console.log("Attempting to create NFT with payload:", nftPayload);

      const pendingTransaction = await petraWallet.signAndSubmitTransaction(nftPayload);
      console.log("Transaction submitted:", pendingTransaction);

      // Wait for transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsLoading(false);
      console.log("NFT creation completed");

      const sellerTickets = await aptos.getOwnedDigitalAssets({
        ownerAddress: seller.accountAddress,
      });

      if (!sellerTickets.length) {
        throw new NoTicketsAvailableError();
      }

    } catch (error) {
      console.error("Detailed NFT creation error:", {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack
      });

      setError(`NFT Creation failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <Header isSignedIn={isAuthenticated} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInWindow />} />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <ProfileDashboard />
                ) : (
                  <SignUpWindow connectWallet={connectWallet} walletAddress={walletAddress} />
                )
              }
            />
            <Route path="/profile" element={<ProfileDashboard />} />
            <Route path="/event" element={<EventListing />} />
            <Route path="/organize" element={<EventCreationForm address={walletAddress} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;