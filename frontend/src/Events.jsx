<<<<<<< HEAD
=======
// import React, { useState } from 'react';
// import { X,Calendar, MapPin, Clock, Filter, Search, Music, Star, Users, Plus, Minus, CreditCard } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { useEffect } from 'react';
// import { getAllUsers } from './Actions/User';
// import { getEvents } from './Actions/Event';
// import { useSelector } from 'react-redux';
// const EventListing = () => {
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   // const [eventy,setEvents] = useState(null);
//   const dispatch = useDispatch();
//   // dispatch(getEvents);
//   useEffect(() => {
//     dispatch(getEvents());
//   }, [])
//   const {events} = useSelector((state) => state.event)
//   console.log(events)
//   const EventCard = ({ event }) => (
//     <div className="bg-black/40 rounded-xl overflow-hidden group hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300">
//       <div className="relative">
//         <img
//           src={event.image.url}
//           alt={event.Title}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
//           ${event.price}
//         </div>
//       </div>
//       <div className="p-6">
//         <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
//         <div className="space-y-2 mb-4">
//           <div className="flex items-center text-gray-300">
//             <Calendar className="w-4 h-4 mr-2 text-pink-500" />
//             {event.Date_and_Time.date} at {event.Date_and_Time.time}
//           </div>
//           <div className="flex items-center text-gray-300">
//             <MapPin className="w-4 h-4 mr-2 text-pink-500" />
//             {/* {event.venue} */}
//           </div>
//         </div>
//         <div className="flex flex-wrap gap-2 mb-4">
//           {/* {event.tags.map((tag, index) => (
//             <span key={index} className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
//               {tag}
//             </span>
//           ))} */}
//         </div>
//         <button
//           onClick={() => setSelectedEvent(event)}
//           className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
//         >
//           Buy Tickets
//         </button>
//       </div>
//     </div>
//   );

//   // Ticket Purchase Modal
//   const TicketPurchaseModal = ({ event, onClose }) => {
//     console.log("I cam here")
//     const [quantity, setQuantity] = useState(1);
//     const [selectedSection, setSelectedSection] = useState('general');

//     const sections = {
//       vip: { name: 'VIP', price: 100 * 2 },
//       premium: { name: 'Premium', price: 100 * 1.5 },
//       general: { name: 'General', price: 100 }
//     };

//     return (
//       <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
//         <div className="bg-gray-900 rounded-2xl max-w-2xl w-full overflow-hidden relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white/50 hover:text-white"
//           >
//             <X className="w-6 h-6" />
//           </button>

//           <div className="grid md:grid-cols-2">
//             {/* Event Image Section */}
//             <div className="relative">
//               <img
//                 src={event.image.url}
//                 alt={event.Title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
//               <div className="absolute bottom-4 left-4 text-white">
//                 <h3 className="text-2xl font-bold">{event.Title}</h3>
//                 <p className="text-gray-300 flex items-center mt-2">
//                   <Calendar className="w-4 h-4 mr-2" />
//                   {event.Date_and_Time.date} at {event.Date_and_Time.time}
//                 </p>
//               </div>
//             </div>

//             {/* Ticket Selection Section */}
//             <div className="p-6 space-y-6">
//               <div>
//                 <h4 className="text-white text-lg font-semibold mb-3">Select Section</h4>
//                 <div className="space-y-2">
//                   {Object.entries(sections).map(([key, section]) => (
//                     <button
//                       key={key}
//                       onClick={() => setSelectedSection(key)}
//                       className={`w-full p-3 rounded-lg flex items-center justify-between ${
//                         selectedSection === key
//                           ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
//                           : 'bg-white/5 text-white hover:bg-white/10'
//                       }`}
//                     >
//                       <span>{section.name}</span>
//                       <span>${section.price}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h4 className="text-white text-lg font-semibold mb-3">Quantity</h4>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
//                   >
//                     <Minus className="w-5 h-5" />
//                   </button>
//                   <span className="text-white text-xl font-semibold">{quantity}</span>
//                   <button
//                     onClick={() => setQuantity(Math.min(10, quantity + 1))}
//                     className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
//                   >
//                     <Plus className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="border-t border-white/10 pt-6">
//                 <div className="flex justify-between text-white mb-2">
//                   <span>Subtotal</span>
//                   <span>${(sections[selectedSection].price * quantity).toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-white mb-4">
//                   <span>Service Fee</span>
//                   <span>${(sections[selectedSection].price * quantity * 0.1).toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-white text-lg font-bold">
//                   <span>Total</span>
//                   <span>${(sections[selectedSection].price * quantity * 1.1).toFixed(2)}</span>
//                 </div>
//               </div>

//               <button className="w-full py-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2">
//                 <CreditCard className="w-5 h-5" />
//                 <span>Proceed to Payment</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-black pt-24">
//       {/* Filter Section */}
//       <div className="max-w-7xl mx-auto px-4 mb-8">
//         <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-lg">
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search events..."
//                 className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
//               />
//               <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" />
//             </div>

//             <div>
//               <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500">
//                 <option value="">Select Category</option>
//                 <option value="electronic">Electronic</option>
//                 <option value="rock">Rock</option>
//                 <option value="jazz">Jazz</option>
//               </select>
//             </div>

//             <div>
//               <input
//                 type="date"
//                 className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
//               />
//             </div>

//             <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2">
//               <Filter className="w-5 h-5" />
//               <span>Filter Results</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Events Grid */}
//       <div className="max-w-7xl mx-auto px-4 mb-16">
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {events.map((event) => (
//             <EventCard key={event._id} event={event} />
//           ))}
//         </div>
//       </div>

//   {/* //     Ticket Purchase Modal */}
//         {selectedEvent && (
//         <TicketPurchaseModal
//           event={selectedEvent}
//           onClose={() => setSelectedEvent(null)}
//         />
//       )}
//     </div>
//   );

//   return (
//     <div></div>
//   )
// };

// export default EventListing;

import React, { useState, useEffect } from 'react';
>>>>>>> d718bb8f98500f0ab0a7a209f1a41b87d277957e
import { X, Calendar, MapPin, Clock, Filter, Search, Music, Star, Users, Plus, Minus, CreditCard } from 'lucide-react';
import { getAllUsers } from './Actions/User';
import { getEvents } from './Actions/Event';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AptosClient } from 'aptos';

const EventListing = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fallbackEvents = [
    {
      _id: '67ba0254f516b63c1e001920',
      title: "Summer Music Festival", 
      image: "https://cdn.vectorstock.com/i/1000x1000/82/01/temporary-rubber-stamp-vector-17998201.webp",
      organiser: '67b9ff4af516b63c1e00914',
      time : "10 PM",
      date : "29th March 2015",
      tickets: [{
        category: "VIP", 
        price: 1, 
        desc: "Awesome Event",
        seats_available: 200,
        _id: '67ba0254f516b63c1e001921'
      },
      {
        category: "VIP", 
        price: 1, 
        desc: "Awesome Event",
        seats_available: 2100,
        _id: '67ba0254f516b63c1ed001921'
      }],
      isFinish: false,
      attendees: [],
      reviews: [],
    },
  ];

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const { events = [] } = useSelector((state) => state.event);
  const displayEvents = events.length > 0 ? events : fallbackEvents;

  const EventCard = ({ event }) => {
    const {
      image = event.image || 'https://cdn.vectorstock.com/i/1000x1000/82/01/temporary-rubber-stamp-vector-17998201.webp',
      title = 'Event Title',
      tickets = [],
      date = "TBd",
      time = "TBd"
    } = event || {};

    const ticketPrice = tickets?.[0]?.price || 'TBA';
    const seatsAvailable = tickets?.[0]?.seats_available || 0;

    return (
      <div className="bg-black/40 rounded-xl overflow-hidden group hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/300';
            }}
          />
          <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
            {ticketPrice}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-pink-500" />
              {date} at {time}
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2 text-pink-500" />
              {seatsAvailable} seats available
            </div>
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
  };

  const TicketPurchaseModal = ({ event, onClose }) => {
    const [selectedTicket, setSelectedTicket] = useState(event.tickets[0]);
    const [quantity, setQuantity] = useState(1);

    const basePrice = parseInt(selectedTicket?.price) || 0;
    const total = basePrice * quantity;
    const serviceFee = total * 0.1;
    const finalTotal = total + serviceFee;

    const handlePayment = async () => {
      setLoading(true);
      try {
        const hash = await transfer("0xb5f96a6656d1b7353ea188666db490bdd9091ae7a987a75432e8c742c1995253", finalTotal);
        setTransactionHash(hash);
        setTransactionSuccess(true);
      } catch (error) {
        alert("❌ Transfer failed. Please try again.");
      } finally {
        setLoading(false);
      }
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

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-white text-lg font-semibold mb-3">Select Ticket Type</h4>
                <div className="space-y-2">
                  {event.tickets.map((ticket) => (
                    <button
                      key={ticket._id}
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setQuantity(1);
                      }}
                      className={`w-full p-3 rounded-lg flex items-center justify-between ${
                        selectedTicket._id === ticket._id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{ticket.category}</span>
                        <span className="text-sm text-gray-300">{ticket.desc}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span>{ticket.price}</span>
                        <span className="text-sm text-gray-300">{ticket.seats_available} seats left</span>
                      </div>
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
                    onClick={() => setQuantity(Math.min(selectedTicket.seats_available, quantity + 1))}
                    className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between text-white mb-2">
                  <span>Subtotal</span>
                  <span>{selectedTicket.price} × {quantity}</span>
                </div>
                <div className="flex justify-between text-white mb-4">
                  <span>Service Fee (10%)</span>
                  <span>{serviceFee.toFixed(2)} Rs</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} Rs</span>
                </div>
              </div>

              <button 
                onClick={handlePayment} 
                disabled={loading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>{loading ? 'Processing...' : 'Proceed to Payment'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SuccessModal = ({ hash, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">🎉 Transaction Successful!</h3>
          <p className="text-gray-300 mb-6">
            Your transaction has been completed successfully. Transaction hash: 
            {/* <a 
              href={`https://explorer.aptoslabs.com/txn/${hash}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-pink-500 hover:underline"
            >
              {hash.slice(0, 10)}...
            </a> */}
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        {/* ... filter section code ... */}
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>

      {selectedEvent && (
        <TicketPurchaseModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {transactionSuccess && (
        <SuccessModal 
          hash={transactionHash} 
          onClose={() => {setTransactionSuccess(false)
            setSelectedEvent(null)
          }}
        />
      )}
    </div>
  );
};

export default EventListing;

const transfer = async (receiverAddress, amount) => {
  const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

  if (!window.aptos) {
    alert("Please install Petra Wallet");
    return;
  }

  const sender = await window.aptos.account();
  const amountInOctas = BigInt(amount * 1_000_000);

  const payload = {
    type: "entry_function_payload",
    function: "0x1::coin::transfer",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [receiverAddress, amountInOctas.toString()],
  };

  const response = await window.aptos.signAndSubmitTransaction(payload);
  await client.waitForTransaction(response.hash);

  return response.hash;
};