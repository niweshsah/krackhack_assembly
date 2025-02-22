import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Trash2, Upload } from 'lucide-react';

const EventCreationForm = () => {
  const [tickets, setTickets] = useState([
    { category: '', description: '', price: '', seatsAvailable: '' }
  ]);

  const addTicketCategory = () => {
    setTickets([...tickets, { category: '', description: '', price: '', seatsAvailable: '' }]);
  };

  const removeTicketCategory = (index) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen bg-black p-8 pt-[82px]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          Create New Event
        </h1>

        <div className="bg-gray-900 border-2 border-purple-500 shadow-2xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="relative">
                <div className="border-2 border-dashed border-purple-400 rounded-lg p-8 text-center hover:border-pink-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <p className="text-gray-300">Drop your event image here or click to browse</p>
                </div>
              </div>

              {/* Event Title */}
              <div>
                <label className="block text-purple-400 mb-2">Event Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                  placeholder="Enter event title"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-400 mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                    <input
                      type="date"
                      className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 pl-12 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-purple-400 mb-2">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                    <input
                      type="time"
                      className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 pl-12 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-purple-400 mb-2">Venue</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 pl-12 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                    placeholder="Enter venue location"
                  />
                </div>
              </div>

              {/* Ticket Categories */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-2xl text-white">Ticket Categories</label>
                  <button
                    type="button"
                    onClick={addTicketCategory}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                    Add Category
                  </button>
                </div>

                <div className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-purple-400">
                      <div className="flex justify-end mb-2">
                        {tickets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketCategory(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-purple-400 mb-2">Category Name</label>
                          <input
                            type="text"
                            className="w-full bg-gray-700 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                            placeholder="e.g., VIP, Regular"
                          />
                        </div>
                        <div>
                          <label className="block text-purple-400 mb-2">Price ($)</label>
                          <input
                            type="number"
                            className="w-full bg-gray-700 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-full">
                          <label className="block text-purple-400 mb-2">Description</label>
                          <input
                            type="text"
                            className="w-full bg-gray-700 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                            placeholder="Describe what's included"
                          />
                        </div>
                        <div>
                          <label className="block text-purple-400 mb-2">Available Seats</label>
                          <input
                            type="number"
                            className="w-full bg-gray-700 border border-purple-400 rounded-lg p-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                            placeholder="Number of seats"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                Create Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreationForm;