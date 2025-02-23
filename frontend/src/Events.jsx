import React, { useState } from 'react';
import { X,Calendar, MapPin, Clock, Filter, Search, Music, Star, Users, Plus, Minus, CreditCard } from 'lucide-react';

const EventListing = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: "Electric Dreams Festival",
      date: "March 15, 2025",
      time: "6:00 PM",
      venue: "Skyline Arena, New York",
      image: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "electronic",
      price: 149,
      artist: "Various Artists",
      description: "The biggest electronic music festival of the year featuring top DJs from around the world.",
      tags: ["Electronic", "Dance", "Festival"],
      capacity: 5000,
      remaining: 750
    },
    {
      id: 2,
      title: "Rock Revolution",
      date: "April 2, 2025",
      time: "7:30 PM",
      venue: "Stadium X, Los Angeles",
      image: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "rock",
      price: 199,
      artist: "The Midnight Rocks",
      description: "Experience the ultimate rock concert with pyrotechnics and special effects.",
      tags: ["Rock", "Live Band", "Concert"],
      capacity: 8000,
      remaining: 1200
    },
    {
      id: 3,
      title: "Jazz Night Special",
      date: "March 28, 2025",
      time: "8:00 PM",
      venue: "Blue Note Club, Chicago",
      image: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "jazz",
      price: 89,
      artist: "Jazz Ensemble",
      description: "An intimate evening of smooth jazz and contemporary fusion.",
      tags: ["Jazz", "Live Music", "Indoor"],
      capacity: 300,
      remaining: 45
    }
    // Add more events as needed
  ];

  const EventCard = ({ event }) => (
    <div className="bg-black/40 rounded-xl overflow-hidden group hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
          ${event.price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-pink-500" />
            {event.date} at {event.time}
          </div>
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2 text-pink-500" />
            {event.venue}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => setSelectedEvent(event)}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
        >
          Buy Tickets
        </button>
      </div>
    </div>
  );

  // Ticket Purchase Modal
  const TicketPurchaseModal = ({ event, onClose }) => {
    console.log("I cam here")
    const [quantity, setQuantity] = useState(1);
    const [selectedSection, setSelectedSection] = useState('general');

    const sections = {
      vip: { name: 'VIP', price: event.price * 2 },
      premium: { name: 'Premium', price: event.price * 1.5 },
      general: { name: 'General', price: event.price }
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl max-w-2xl w-full overflow-hidden relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Event Image Section */}
            <div className="relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <p className="text-gray-300 flex items-center mt-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date} at {event.time}
                </p>
              </div>
            </div>

            {/* Ticket Selection Section */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-white text-lg font-semibold mb-3">Select Section</h4>
                <div className="space-y-2">
                  {Object.entries(sections).map(([key, section]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedSection(key)}
                      className={`w-full p-3 rounded-lg flex items-center justify-between ${
                        selectedSection === key
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{section.name}</span>
                      <span>${section.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white text-lg font-semibold mb-3">Quantity</h4>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-white text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between text-white mb-2">
                  <span>Subtotal</span>
                  <span>${(sections[selectedSection].price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white mb-4">
                  <span>Service Fee</span>
                  <span>${(sections[selectedSection].price * quantity * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold">
                  <span>Total</span>
                  <span>${(sections[selectedSection].price * quantity * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full py-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-lg">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>
            
            <div>
              <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500">
                <option value="">Select Category</option>
                <option value="electronic">Electronic</option>
                <option value="rock">Rock</option>
                <option value="jazz">Jazz</option>
              </select>
            </div>
            
            <div>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
            
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filter Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Ticket Purchase Modal */}
      {selectedEvent && (
        <TicketPurchaseModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventListing;