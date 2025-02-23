import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

const EventListingPage = () => {
  const [events] = useState([
    {
      id: 1,
      title: "Summer Night Festival",
      date: "2025-06-15",
      time: "20:00",
      venue: "Neon Garden Arena",
      image: "/api/placeholder/800/400",
      tickets: [
        {
          category: "VIP",
          description: "Front row access, free drinks",
          price: 150,
          seatsAvailable: 50
        },
        {
          category: "Regular",
          description: "General admission",
          price: 75,
          seatsAvailable: 200
        }
      ]
    },
    {
      id: 2,
      title: "Electric Dreams Party",
      date: "2025-07-01",
      time: "21:00",
      venue: "Cyber Club Downtown",
      image: "/api/placeholder/800/400",
      tickets: [
        {
          category: "Premium",
          description: "VIP lounge access",
          price: 120,
          seatsAvailable: 75
        },
        {
          category: "Standard",
          description: "Dance floor access",
          price: 60,
          seatsAvailable: 150
        }
      ]
    }
  ]);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          Upcoming Events
        </h1>

        <div className="grid gap-8">
          {events.map((event) => (
            <Card key={event.id} className="bg-gray-900 border-2 border-purple-500 shadow-2xl overflow-hidden hover:shadow-purple-500/50 transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                </div>

                <div className="p-6">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-white mb-4">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-purple-400" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="text-purple-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="text-purple-400" />
                        <span>{event.venue}</span>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Tickets</h3>
                        <div className="space-y-4">
                          {event.tickets.map((ticket, index) => (
                            <div
                              key={index}
                              className="bg-gray-800 p-4 rounded-lg border border-purple-400 hover:border-pink-400 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-semibold text-white">
                                  {ticket.category}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Ticket className="text-purple-400" size={16} />
                                  <span className="text-sm text-gray-400">
                                    {ticket.seatsAvailable} left
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{ticket.description}</p>
                              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                ${ticket.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventListingPage;