import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { useDispatch } from "react-redux";
import { registerUser } from "./Actions/User";
import { loginUser } from './Actions/User';
const SignInWindow = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
    // const res = await loginUser(email, password);
    console.log('Signing in with:', { email, password});
  };

  return (
    <div className="min-h-screen bg-black p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Glowing border effect */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 animate-pulse" />

          <div className="relative bg-gray-900 rounded-lg shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Welcome Back
              </h1>
              <p className="text-gray-400 mt-2">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-purple-400 mb-2">Your Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 pl-12 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-purple-400 mb-2">Your Password</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 pl-12 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-colors outline-none"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={!email || !password}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign In
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>Ensure your credentials are correct before proceeding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInWindow;
