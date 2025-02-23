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
import { X, Calendar, MapPin, Clock, Filter, Search, Music, Star, Users, Plus, Minus, CreditCard } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from './Actions/Event';

const EventListing = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const { events = [], loading } = useSelector((state) => state.event);
  const EventCard = ({ event }) => (
    <div className="bg-black/40 rounded-xl overflow-hidden group hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300">
      <div className="relative">
        <img
          src={event.image.url}
          alt={event.Title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
          ${event.tickets[0].price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-pink-500" />
            {event.Date_and_Time.date} at {event.Date_and_Time.time}
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

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-white text-lg">Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-white text-lg">No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListing;
