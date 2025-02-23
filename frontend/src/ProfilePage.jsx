import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Wallet, Copy, Ticket, User, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { loadUser } from './Actions/User';
const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const dispatch = useDispatch();
  // Sample data - replace with actual data from blockchain/backend
  
  // useEffect(() => {
  //   dispatch(loadUser());
  // }, [dispatch]);
  
  const { user } = useSelector((state) => state.user);
  const userProfile = {
    name: user.name,
    age: 28,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    totalEventsOrganized: user.events_organised.length,
    totalTicketsPurchased: user.events_attended.length,
  };
  useEffect(() => {
    if (user) {
      console.log('User:', user);
    }
    else {
      console.log("User Does not exist");
    }
  }, [user]);
  // const upcomingTickets = loop 
  const upcomingTickets = [
    {
      id: 1,
      eventName: "Summer Night Festival",
      date: "2025-06-15",
      time: "20:00",
      venue: "Neon Garden Arena",
      ticketType: "VIP",
      ticketId: "#NFT-789",
      price: 150,
    },
    {
      id: 2,
      eventName: "Electric Dreams Party",
      date: "2025-07-01",
      time: "21:00",
      venue: "Cyber Club Downtown",
      ticketType: "Premium",
      ticketId: "#NFT-790",
      price: 120,
    }
  ];
  
  const organizedEvents = [
    {
      id: 1,
      name: "Blockchain Beats",
      date: "2025-08-15",
      time: "22:00",
      venue: "Digital Arena",
      totalTickets: 500,
      soldTickets: 320,
      revenue: 32000,
      status: "Active"
    },
    {
      id: 2,
      name: "Crypto Concert",
      date: "2025-09-01",
      time: "20:00",
      venue: "Meta Stadium",
      totalTickets: 1000,
      soldTickets: 750,
      revenue: 75000,
      status: "Active"
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-black pt-[102px] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-6 mb-8 shadow-xl hover:shadow-purple-500/20 transition-all">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                {userProfile.name}
              </h1>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <User size={20} className="text-purple-400" />
                  <span>Age: {userProfile.age}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Wallet size={20} className="text-purple-400" />
                  <span className="text-sm truncate">{userProfile.walletAddress}</span>
                  <button 
                    onClick={() => copyToClipboard(userProfile.walletAddress)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-purple-400">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {userProfile.totalEventsOrganized}
                </div>
                <div className="text-gray-300">Events Organized</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-purple-400">
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {userProfile.totalTicketsPurchased}
                </div>
                <div className="text-gray-300">Tickets Owned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Tickets
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'organized'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('organized')}
          >
            Organized Events
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-6">
          {activeTab === 'upcoming' ? (
            // Upcoming Tickets
            upcomingTickets.map(ticket => (
              <div key={ticket.id} className="bg-gray-900 border border-purple-500 rounded-lg p-6 hover:shadow-purple-500/20 transition-all">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{ticket.eventName}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar size={20} className="text-purple-400" />
                        <span>{new Date(ticket.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={20} className="text-purple-400" />
                        <span>{ticket.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin size={20} className="text-purple-400" />
                        <span>{ticket.venue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-purple-400 font-semibold">{ticket.ticketType}</span>
                      <span className="text-gray-400">{ticket.ticketId}</span>
                    </div>
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      ${ticket.price}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Organized Events
            organizedEvents.map(event => (
              <div key={event.id} className="bg-gray-900 border border-purple-500 rounded-lg p-6 hover:shadow-purple-500/20 transition-all">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{event.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar size={20} className="text-purple-400" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={20} className="text-purple-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin size={20} className="text-purple-400" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Star size={20} className="text-purple-400" />
                        <span>Status: {event.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400 mb-2">Tickets Sold</div>
                      <div className="text-2xl font-bold text-white">
                        {event.soldTickets} / {event.totalTickets}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-600 h-2 rounded-full"
                          style={{ width: `${(event.soldTickets / event.totalTickets) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400 mb-2">Revenue</div>
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        ${event.revenue}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;