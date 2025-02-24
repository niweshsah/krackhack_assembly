import React, { useState, useEffect } from 'react';
import { X, Music, Ticket, Calendar } from 'lucide-react';
import { ChevronLeft, ChevronRight, Search, User, ShoppingCart, Menu, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ isSignedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Profile button content based on sign-in state
  const renderProfileButton = () => {
    if (isSignedIn) {
      return (
        <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
          <User className="w-5 h-5 text-white" />
          <span className="text-white">Profile</span>
        </Link>
      );
    }
    return (
      <Link to="/signin" className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
        <User className="w-5 h-5 text-white" />
        <span className="text-white">Sign Up</span>
      </Link>
    );
  };

  // Mobile menu profile button
  const renderMobileProfileButton = () => {
    if (isSignedIn) {
      return (
        <Link to="/profile" className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center space-x-2">
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      );
    }
    return (
      <Link to="/signin" className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center space-x-2">
        <User className="w-5 h-5" />
        <span>Sign Up</span>
      </Link>
    );
  };

  return (
    <div>
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl pb-4 mx-auto">
          {/* Top Bar with gradient border */}
          <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
          
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo Area */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 animate-pulse"></div>
                  <Ticket className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
                  TicketApp
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {/* Animated Nav Items */}
                <div className="group relative">
                  <Link to="/" className="text-white py-2 px-4 rounded-full transition-all duration-300 hover:bg-white/10">
                    Home
                  </Link>
                  <div className="absolute inset-x-0 h-0.5 bottom-0 bg-gradient-to-r from-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </div>
                <div className="group relative">
                  <Link to="/event" className="text-white py-2 px-4 rounded-full transition-all duration-300 hover:bg-white/10">
                    Events
                  </Link>
                  <div className="absolute inset-x-0 h-0.5 bottom-0 bg-gradient-to-r from-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </div>
                <div className="group relative">
                  <Link to="/organize" className="text-white py-2 px-4 rounded-full transition-all duration-300 hover:bg-white/10">
                    Organize
                  </Link>
                  <div className="absolute inset-x-0 h-0.5 bottom-0 bg-gradient-to-r from-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </div>
                {/* <div className="group relative">
                  <a href="#" className="text-white py-2 px-4 rounded-full transition-all duration-300 hover:bg-white/10">
                    Concerts
                  </a>
                  <div className="absolute inset-x-0 h-0.5 bottom-0 bg-gradient-to-r from-cyan-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </div> */}
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Search Button */}
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
                  <Search className="w-5 h-5 text-white group-hover:text-pink-400" />
                </button>

                {/* Profile/Sign In Button */}
                {renderProfileButton()}
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            {/* Search Bar Overlay */}
            <div className={`absolute inset-x-0 top-full mt-2 px-4 transition-all duration-300 ${
              isSearchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}>
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events, artists, or venues..."
                    className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 top-[73px] bg-black/95 backdrop-blur-lg transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}>
          <div className="p-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-white py-3 px-4 rounded-lg hover:bg-white/10 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Events</span>
              </a>
              <a href="#" className="text-white py-3 px-4 rounded-lg hover:bg-white/10 flex items-center space-x-2">
                <Music className="w-5 h-5" />
                <span>Festivals</span>
              </a>
              <a href="#" className="text-white py-3 px-4 rounded-lg hover:bg-white/10 flex items-center space-x-2">
                <Ticket className="w-5 h-5" />
                <span>Concerts</span>
              </a>
            </nav>
            
            <div className="mt-8 space-y-4">
            
              {renderMobileProfileButton()}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;