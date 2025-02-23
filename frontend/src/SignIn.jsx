import React, { useState } from 'react';
import { Wallet, User, ArrowRight } from 'lucide-react';

const SignInWindow = () => {
  const [name, setName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } else {
        alert('Please install MetaMask to continue!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
    setIsConnecting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Signing in with:', { name, walletAddress });
  };

  return (
    <div className="min-h-screen bg-black p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Glowing border effect */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 animate-pulse" />
          
          <div className="relative bg-gray-900 rounded-lg shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Welcome Back
              </h1>
              <p className="text-gray-400 mt-2">Connect your wallet to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-purple-400 mb-2">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 pl-12 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Wallet Connection */}
              <div>
                <label className="block text-purple-400 mb-2">Wallet Address</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                  <input
                    type="text"
                    value={walletAddress}
                    className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 pl-12 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                    placeholder="Connect wallet to display address"
                    readOnly
                  />
                </div>
                
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="mt-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                >
                  {isConnecting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Wallet size={20} />
                      {walletAddress ? 'Wallet Connected' : 'Connect Wallet'}
                    </>
                  )}
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={!name || !walletAddress}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign In
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>Make sure you have MetaMask installed</p>
              <p className="mt-1">Your wallet will be used to manage your tickets and events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInWindow;