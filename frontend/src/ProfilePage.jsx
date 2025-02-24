import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Wallet, Copy, Ticket, User, Star, QrCode } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Actions/User';
import { TicketingSystem } from '../../nft_code/dist/main_nft_export';
import { QRCodeSVG } from 'qrcode.react';

const ticketing = new TicketingSystem(); // Keep this outside to avoid re-instantiating

const ProfileDashboard = ({email}) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [ownedTickets, setOwnedTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // Load user data
    dispatch(loadUser(email));
  }, [dispatch]);

  useEffect(() => {
    // Fetch NFT tickets when user data is available
    const fetchTickets = async () => {
      if (user?.walletId) {
        setIsLoading(true);
        try {
          const data = await ticketing.func3(user.walletId);
          console.log('NFT Tickets:', data);
          setOwnedTickets(data || []);
        } catch (error) {
          console.error('Error fetching NFT tickets:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchTickets();
  }, [user]);

  // Format a date from timestamp
  // const formatDate = (timestamp) => {
  //   if (!timestamp) return 'TBD';
  //   try {
  //     return new Date(timestamp).toLocaleDateString('en-US', {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric'
  //     });
  //   } catch (e) {
  //     return 'Invalid Date';
  //   }
  // };
  const formatDate = "29 March 2025"
  // Prepare ticket data for QR code
  const prepareTicketQRData = (ticket) => {
    const qrData = {
      ticketId: ticket.token_data_id,
      tokenName: ticket.current_token_data?.token_name,
      collection: ticket.current_token_data?.collection_id,
      owner: ticket.owner_address,
      description: ticket.current_token_data?.description
    };
    return JSON.stringify(qrData);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert('Copied to clipboard');
  };

  // Organized events (keeping this empty as it's outside the current focus)
  const organizedEvents = [];

  return (
    <div className="min-h-screen bg-black pt-[102px] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-6 mb-8 shadow-xl hover:shadow-purple-500/20 transition-all">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                {user?.name}
              </h1>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Wallet size={20} className="text-purple-400" />
                  <span className="text-sm truncate">{user?.walletId || 'Loading...'}</span>
                  {user?.walletId && (
                    <button 
                      onClick={() => copyToClipboard(user.walletId)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <Copy size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-purple-400">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {user?.events_organised?.length || 0}
                </div>
                <div className="text-gray-300">Events Organized</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-purple-400">
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {ownedTickets.length}
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
            Owned Tickets
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
            isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-gray-400">Loading your tickets...</p>
              </div>
            ) : ownedTickets.length === 0 ? (
              <div className="bg-gray-900 border border-purple-500 rounded-lg p-12 text-center">
                <Ticket className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Tickets Found</h3>
                <p className="text-gray-400">You don't own any tickets yet. Browse events to purchase tickets.</p>
              </div>
            ) : (
              // Owned Tickets from NFT data
              ownedTickets.map((ticket, index) => (
                <div key={ticket.token_data_id || index} className="bg-gray-900 border border-purple-500 rounded-lg p-6 hover:shadow-purple-500/20 transition-all">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {ticket.current_token_data?.token_name || 'Untitled Ticket'}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar size={20} className="text-purple-400" />
                          <span>29TH March 2025</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Star size={20} className="text-purple-400" />
                          <span>{ticket.current_token_data?.description || 'No description'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Ticket size={20} className="text-purple-400" />
                          <span className="text-sm truncate">Token ID: {ticket.token_data_id ? ticket.token_data_id.substring(0, 16) + '...' : 'N/A'}</span>
                          {ticket.token_data_id && (
                            <button 
                              onClick={() => copyToClipboard(ticket.token_data_id)}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Copy size={16} />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <User size={20} className="text-purple-400" />
                          <span>Quantity: {ticket.amount || 1}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg">
                      <div className="mb-3 text-gray-300 font-semibold">Ticket QR Code</div>
                      <div className="bg-white p-2 rounded">
                        <QRCodeSVG
                          value={prepareTicketQRData(ticket)} 
                          size={128} 
                          level="H"
                        />
                      </div>
                      <div className="mt-3 text-sm text-gray-400">Scan for verification</div>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            // Organized Events (unchanged)
            organizedEvents.length === 0 ? (
              <div className="bg-gray-900 border border-purple-500 rounded-lg p-12 text-center">
                <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Events Organized</h3>
                <p className="text-gray-400">You haven't organized any events yet.</p>
              </div>
            ) : (
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;