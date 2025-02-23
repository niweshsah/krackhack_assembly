import React, { useEffect, useState } from 'react';
import { Music, Disc, Radio, Mic } from 'lucide-react';

const FloatingElements = () => {
  const [scroll, setScroll] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative h-screen w-full  bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 " />
      
      {/* Animated Circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-pulse" 
          style={{ 
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            animation: 'pulse 4s infinite'
          }} 
        />
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{ 
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            animation: 'pulse 5s infinite'
          }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse"
          style={{ 
            transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`,
            animation: 'pulse 6s infinite'
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative h-full flex items-center justify-center">
        {/* Center Stage Element */}
        <div className="relative w-96 h-96">
          {/* Central Microphone */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
            style={{ 
              transform: `translate(-50%, -50%) 
                         rotate(${mousePosition.x * 0.1}deg) 
                         translateZ(${50 + mousePosition.y * 0.5}px)`
            }}
          >
            <div className="relative">
              {/* Microphone Base */}
              <div className="w-40 h-40 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <Mic className="w-20 h-20 text-white" />
              </div>
              
              {/* Glowing Ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
            </div>
          </div>

          {/* Floating Musical Notes */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 150}%`,
                top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 150}%`,
                transform: `translate(-50%, -50%) 
                           rotate(${mousePosition.x * 0.2}deg) 
                           translateZ(${20 + mousePosition.y * 0.3}px)`,
                animation: `float ${3 + i}s infinite ease-in-out`
              }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                {i % 3 === 0 ? (
                  <Music className="w-8 h-8 text-white" />
                ) : i % 3 === 1 ? (
                  <Disc className="w-8 h-8 text-white" />
                ) : (
                  <Radio className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translateZ(${Math.random() * 50}px)`,
            animation: `float ${2 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`
          }}
        />
      ))}

      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="max-w-3xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Experience the 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"> Magic </span>
            of Live Events
          </h1>
          <p className="text-xl text-gray-300 mb-8">Get ready for unforgettable moments with your favorite artists</p>
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)]">
            Explore Events
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingElements;