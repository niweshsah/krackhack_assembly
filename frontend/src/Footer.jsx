import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
              TicketHub
            </h3>
            <p className="text-gray-400">
              Your premier destination for event tickets and unforgettable experiences.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-purple-400 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-purple-500 transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-500 transition">Events</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-500 transition">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-500 transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-blue-400 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400 hover:text-blue-400">
                <Mail className="h-5 w-5 mr-2 text-blue-500" /> info@tickethub.com
              </li>
              <li className="flex items-center text-gray-400 hover:text-blue-400">
                <Phone className="h-5 w-5 mr-2 text-blue-500" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center text-gray-400 hover:text-blue-400">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" /> 123 Event Street, NY
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-pink-400 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; 2025 TicketHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
