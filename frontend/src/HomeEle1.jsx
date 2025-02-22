import React from 'react';
import { Ticket, PartyPopper, Music, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-12 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 animate-gradient">
              Step into the Future
            </span>
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              of Event Ticketing
            </span>
          </h1>
          
          <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-12">
            Experience events like never before with blockchain-powered tickets. 
            Secure, transparent, and unforgettable.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
              Create Event
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300">
              Explore Events
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-50">
          {/* Left Side */}
          <div className="animate-float-slow">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transform rotate-45 backdrop-blur-lg" />
          </div>
          
          {/* Center */}
          <div className="animate-float">
            <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-lg" />
          </div>
          
          {/* Right Side */}
          <div className="animate-float-slow">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transform -rotate-45 backdrop-blur-lg" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-24">
          {[
            { icon: <Ticket className="w-8 h-8" />, title: "NFT Tickets", desc: "Unique digital collectibles" },
            { icon: <PartyPopper className="w-8 h-8" />, title: "Exclusive Events", desc: "Premium experiences" },
            { icon: <Music className="w-8 h-8" />, title: "Live Shows", desc: "Unforgettable moments" },
            { icon: <Star className="w-8 h-8" />, title: "VIP Access", desc: "Special privileges" }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 backdrop-blur-lg p-6 rounded-lg border border-purple-500/20 hover:border-purple-500 transition-all duration-300"
            >
              <div className="text-purple-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

// Add these animations to your global CSS or Tailwind config
const style = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animate-float-slow {
    animation: float-slow 8s ease-in-out infinite;
  }
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
  }
`;

export default HeroSection;