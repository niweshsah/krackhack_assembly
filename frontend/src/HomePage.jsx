
import React, { useState, useEffect } from 'react';
import {   X, Music, Ticket, Calendar } from 'lucide-react';
import { ChevronLeft, ChevronRight,  Search, User, ShoppingCart, Menu, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import FloatingElements from './Magic';
import HeroSection from './HomeEle1';
import MircroModel from './model';
const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Previous events and trending data remain the same...

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % events.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  const events = [
    {
      id: 1,
      title: "Taylor Swift - Eras Tour",
      date: "March 15, 2025",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "$199"
    },
    {
      id: 2,
      title: "Coldplay World Tour",
      date: "April 2, 2025",
      image: "https://plus.unsplash.com/premium_photo-1661299366011-bb9f86212bdb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "$149"
    },
    {
      id: 3,
      title: "EDM Festival 2025",
      date: "May 20, 2025",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "$299"
    }
  ];

  const trending = [
    {
      id: 4,
      title: "Basketball Championship",
      date: "March 28, 2025",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "$85"
    },
    {
      id: 5,
      title: "Comedy Night Special",
      date: "April 5, 2025",
      image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "$45"
    },
    {
      id: 6,
      title: "Broadway Musical",
      date: "April 15, 2025",
      image: "https://img.freepik.com/premium-photo/crowd-concert-with-blue-background_700955-4523.jpg?w=1800",
      price: "$120"
    }
  ];


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Modern Glassmorphism Header */}

      <div className="pt-[73px]">
           {/* Hero Carousel */}
           
           <div className="relative h-[720px] overflow-hidden">
        <div 
          className="flex transition-transform duration-500 h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {events.map((event) => (
            <div key={event.id} className="min-w-full relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                    {event.title}
                  </h2>
                  <p className="text-xl mb-6 text-blue-300">{event.date}</p>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                    Get Tickets from {event.price}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/50 p-2 rounded-full hover:bg-gray-900/80 border border-blue-500/30"
        >
          <ChevronLeft className="h-6 w-6 text-blue-400" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/50 p-2 rounded-full hover:bg-gray-900/80 border border-blue-500/30"
        >
          <ChevronRight className="h-6 w-6 text-blue-400" />
        </button>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full border border-blue-500 ${
                currentSlide === index ? 'bg-blue-500' : 'bg-transparent'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
        <HeroSection/>
        <div style={{ width: "100vw", height: "100vh" }}>
      {/* <MircroModel /> */}
      {/* <FloatingElements/> */}
    </div>
      {/* Trending Events Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          Trending Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trending.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition group">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-100">{event.title}</h3>
                <p className="text-gray-400 mb-4">{event.date}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-bold">{event.price}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    Buy Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     
    </div>
      </div>
  );
};

export default HomePage;