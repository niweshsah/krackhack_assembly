// import React, { useState } from 'react';
// import { Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { createNewEvent } from './Actions/Event'
// // import TicketingSystem from '../../nft_code/dist/main_nft'
// import {TicketingSystem} from '../../nft_code/dist/main_nft_export'
// const EventCreationForm = () => {
//   const [eventData, setEventData] = useState({
//     image: '',
//     title: '',
//     date : '',
//     time : '',
//     venue: '',
//     organiser : '',
//     artist : ''
//   });
//   const dispatch = useDispatch();
//   const [tickets, setTickets] = useState([
//     { category: '', price: 0, desc: '', seats_available: 0 }
//   ]);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'date' || name === 'time') {
//       setEventData((prev) => ({
//         ...prev,
//         Date_and_Time: { ...prev.Date_and_Time, [name]: value }
//       }));
//     } else {
//       setEventData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleTicketChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedTickets = [...tickets];
//     updatedTickets[index][name] = value;
//     setTickets(updatedTickets);
//   };

//   const addTicketCategory = () => {
//     setTickets([...tickets, { category: '', price: '', desc: '', seats_available: '' }]);
//   };

//   const removeTicketCategory = (index) => {
//     setTickets(tickets.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Dispatch Redux action to store event
//     dispatch(createNewEvent(eventData.image, eventData.title, eventData.Date_and_Time, tickets));
//   };


//   return (
//     <div className="min-h-screen bg-black p-8 pt-[82px]">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
//           Create New Event
//         </h1>

//         <div className="bg-gray-900 border-2 border-purple-500 shadow-2xl rounded-lg overflow-hidden">
//           <div className="p-6">
//             <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-purple-400 mb-2">Enter Image URL</label>
//                 <input
//                   type="text"
//                   name="image"
//                   value={eventData.image}
//                   onChange={handleChange}
//                   className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400"
//                   placeholder="Enter event image URL"
//                 />
//               </div>
//               <div>
//                 <label className="block text-purple-400 mb-2">Event Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={eventData.title}
//                   onChange={handleChange}
//                   className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400"
//                   placeholder="Enter event title"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-purple-400 mb-2">Date</label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={eventData.Date_and_Time.date}
//                     onChange={handleChange}
//                     className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-purple-400 mb-2">Time</label>
//                   <input
//                     type="time"
//                     name="time"
//                     value={eventData.Date_and_Time.time}
//                     onChange={handleChange}
//                     className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-purple-400 mb-2">Venue</label>
//                 <input
//                   type="text"
//                   name="venue"
//                   value={eventData.venue}
//                   onChange={handleChange}
//                   className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400"
//                   placeholder="Enter venue location"
//                 />
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <label className="text-2xl text-white">Ticket Categories</label>
//                   <button
//                     type="button"
//                     onClick={addTicketCategory}
//                     className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
//                   >
//                     <Plus size={20} /> Add Category
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   {tickets.map((ticket, index) => (
//                     <div key={index} className="bg-gray-800 p-4 rounded-lg border border-purple-400">
//                       <div className="flex justify-end mb-2">
//                         {tickets.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeTicketCategory(index)}
//                             className="text-red-400 hover:text-red-300"
//                           >
//                             <Trash2 size={20} />
//                           </button>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-purple-400 mb-2">Category Name</label>
//                           <input type="number" name="category" placeholder="e.g., VIP, Regular" value={ticket.category} onChange={(e) => handleTicketChange(index, e)} />
//                         </div>
//                         <div>
//                           <label className="block text-purple-400 mb-2">Price ($)</label>
//                           <input type="text" name="price" placeholder="0.00" value={ticket.price} onChange={(e) => handleTicketChange(index, e)} />
//                         </div>
//                         <div>
//                           <label className="block text-purple-400 mb-2">Description</label>
//                           <input type="text" name="desc" placeholder="Describe what's included" value={ticket.desc} onChange={(e) => handleTicketChange(index, e)} />
//                         </div>
//                         <div>
//                           <label className="block text-purple-400 mb-2">Available Seats</label>
//                           <input type="number" name="seats_available" placeholder="Number of seats" value={ticket.seats_available} onChange={(e) => handleTicketChange(index, e)} />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg">
//                 Create Event
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventCreationForm;

// const handleSubmit = (e) => {
//   e.preventDefault();
//   dispatch(createNewEvent(eventData.image, eventData.title, eventData.Date_and_Time, tickets))
//   const ticketing = new TicketingSystem();

//   console.log("\n2. Creating Ticket Collection");
//   console.log("--------------------------");
//   const collectionInfo = {
//     name: eventData.title,
//     uri: "https://example.com/tickets-in-frontend",
//     description: eventData.Date_and_Time,
//   };

//   yield ticketing.createCollection(organizer, collectionInfo);



//   console.log('Event Data:', eventData);
//   console.log('Tickets:', tickets);
// };


// import React, { useState } from 'react';
// import { Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { createNewEvent } from './Actions/Event';
// import { TicketingSystem } from '../../nft_code/dist/main_nft_export';
// import Cookies from "js-cookie";
// import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey, } from "@aptos-labs/ts-sdk";

// // import { v4 as uuidv4 } from 'uuid';

// // import { TicketingSystem } from '../../nft_code/dist/main_nft_export';



// const EventCreationForm = () => {
//   const [image, setImage] = useState('');
//   const [title, setTitle] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [venue, setVenue] = useState('');
//   const [organiser, setOrganiser] = useState('');
//   const [artist, setArtist] = useState('');

//   const dispatch = useDispatch();
//   const [tickets, setTickets] = useState([
//     { category: '', price: 0, desc: '', seats_available: 0 }
//   ]);

//   const handleTicketChange = (index, e) => {
//     const { name, value } = e.target;
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket, i) =>
//         i === index ? { ...ticket, [name]: value } : ticket
//       )
//     );
//   };

//   const addTicketCategory = () => {
//     setTickets([...tickets, { category: '', price: 0, desc: '', seats_available: 0 }]);
//   };

//   const removeTicketCategory = (index) => {
//     setTickets(tickets.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // ❌ This should be moved outside

//     try {
//         // Assuming `ticketing` is already defined in the component
//         // Assuming ticketing is already defined in the component
//         console.log("\n2. Creating Ticket Collection");
//         console.log("--------------------------");
//         const ticketing = new TicketingSystem();

//         const backendPrivateKey = new Ed25519PrivateKey("0x7d90b6baf67a4f6e8a9194df96ca1115ce8dfae22b1e980d81e01ac798c2056d");
//         const organizer = Account.fromPrivateKey({ privateKey: backendPrivateKey });

//       console.log('organizer: ', organizer)

//         const collectionInfo = {
//             name: {title},
//             // name: `${title}-${Date.now()}-${uuidv4().slice(0, 8)}`, // Unique name with title
//             // name: ${title}-${Date.now()}-${uuidv4().slice(0, 8)}, // Unique name with title
//             uri: "https://example.com/tickets",
//             description: "Exclusive event tickets.",
//         };

//         // const organizer = "0x123456789abcdef"; // Replace with actual organizer wallet
//         // const backendPrivateKey = new Ed25519PrivateKey("0x7d90b6baf67a4f6e8a9194df96ca1115ce8dfae22b1e980d81e01ac798c2056d");
//         // const organizer = Account.fromPrivateKey({ privateKey: backendPrivateKey });

//         await ticketing.createCollection(organizer, collectionInfo);

//         // Dispatch event creation with actual event data
//         // dispatch(createNewEvent({
//         //     title: "Concert Tickets",
//         //     date: "2025-06-15",
//         //     time: "20:00",
//         //     venue: "Neon Garden Arena",
//         //     organizer : "Manan" // Ensure organizer is included
//         // }));
        
//     } catch (error) {
//         console.error("Error creating event:", error);
//     }
// };

//   return (
//     <div className="min-h-screen bg-black p-8 pt-[82px] text-white">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
//           Create New Event
//         </h1>
//         <div className="bg-gray-900 border-2 border-purple-500 shadow-2xl rounded-lg overflow-hidden">
//           <div className="p-6">
//             <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
//             <form onSubmit={handleSubmit} className="space-y-6 text-white">
//               <input type="text" name="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Enter event image URL" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//               <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter event title" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//               <input type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//               <input type="time" name="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//               <input type="text" name="venue" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Enter venue location" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//               <input type="text" name="organiser" value={organiser} onChange={(e) => setOrganiser(e.target.value)} placeholder="Enter organiser name" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//               <input type="text" name="artist" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Enter artist name" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />

//               <div>
//                 <h3 className="text-xl text-white">Ticket Categories</h3>
//                 {tickets.map((ticket, index) => (
//                   <div key={index} className="p-2 border border-gray-600 text-white">
//                     <input type="text" name="category" placeholder="Category" value={ticket.category} onChange={(e) => handleTicketChange(index, e)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//                     <input type="number" name="price" placeholder="Price" value={ticket.price} onChange={(e) => handleTicketChange(index, e)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//                     <input type="text" name="desc" placeholder="Description" value={ticket.desc} onChange={(e) => handleTicketChange(index, e)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//                     <input type="number" name="seats_available" placeholder="Seats Available" value={ticket.seats_available} onChange={(e) => handleTicketChange(index, e)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white" />
//                     <button type="button" onClick={() => removeTicketCategory(index)} className="text-red-400">Remove</button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={addTicketCategory} className="text-purple-400">Add Ticket Category</button>
//               </div>

//               <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg">Create Event</button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventCreationForm;



import { Buffer } from 'buffer';


import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createNewEvent } from './Actions/Event';
import { TicketingSystem } from '../../nft_code/dist/main_nft_export';

const ticketing = new TicketingSystem(); // Keep this outside to avoid re-instantiating


const EventCreationForm = () => {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [organiser, setOrganiser] = useState('');
  const [artist, setArtist] = useState('');
  const [tickets, setTickets] = useState([{ category: '', price: 0, desc: '', seats_available: 0 }]);
  // const [organizer, setOrganizer] = useState(null);

  const dispatch = useDispatch();

  const handleTicketChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setTickets((prevTickets) =>
      prevTickets.map((ticket, i) => (i === index ? { ...ticket, [name]: value } : ticket))
    );
  }, []);

  const addTicketCategory = useCallback(() => {
    setTickets((prevTickets) => [...prevTickets, { category: '', price: 0, desc: '', seats_available: 0 }]);
  }, []);

  const removeTicketCategory = useCallback((index) => {
    setTickets((prevTickets) => prevTickets.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!organizer) {
    //   console.error("Organizer is not loaded yet!");
    //   return;
    // }

    try {
      console.log("Creating Ticket Collection..fsdf.");

      await ticketing.func(title,tickets);
      console.log(tickets);
      dispatch(createNewEvent({ title, date, time, venue, organiser, artist, tickets }));
      console.log("Event successfully created!");
    } catch (error) {
      console.error("Error creating event:", error);
    }

    
  };

  return (
    <div className="min-h-screen bg-black p-8 pt-[82px] text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          Create New Event
        </h1>
        <div className="bg-gray-900 border-2 border-purple-500 shadow-2xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Event image URL" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
              <input type="text" value={organiser} onChange={(e) => setOrganiser(e.target.value)} placeholder="Organiser" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
              <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist" className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />

              <div>
                <h3 className="text-xl text-white">Ticket Categories</h3>
                {tickets.map((ticket, index) => (
                  <div key={index} className="p-2 border border-gray-600 text-white">
                    <input type="text" name="category" placeholder="Category" value={ticket.category} onChange={(e) => handleTicketChange(index, e)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
                    <input type="number" name="price" placeholder="Price" value={ticket.price} onChange={(e) => handleTicketChange(index, e)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
                    <input type="text" name="desc" placeholder="Description" value={ticket.desc} onChange={(e) => handleTicketChange(index, e)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
                    <input type="number" name="seats_available" placeholder="Seats Available" value={ticket.seats_available} onChange={(e) => handleTicketChange(index, e)} className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3" />
                    <button type="button" onClick={() => removeTicketCategory(index)} className="text-red-400">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addTicketCategory} className="text-purple-400">Add Ticket Category</button>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg">Create Event</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreationForm;