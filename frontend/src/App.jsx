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


function App() {
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    console.log("Updated Address:", address);
  }, [address]); // Logs when `address` state updates

  const connectWallet = async () => {
    try {
      const petraWallet = new PetraWallet();
      await petraWallet.connect();
      setWallet(petraWallet);
      setIsConnected(true);

      // Fetch wallet address
      const account = await petraWallet.account();

      setWalletAddress(account.address);

    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setIsConnected(false);
    }
  };

  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
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
