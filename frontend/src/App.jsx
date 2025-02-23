import React from 'react';  // Ensure React is imported
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import EventListing from './Events';
import EventCreationForm from './CreateEvent';
import ProfileDashboard from './ProfilePage';
import SignInWindow from './SignIn';

function App() {
  return (
    <Router>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="Signin" element={<SignInWindow />} />
            <Route path="/Profile" element={<ProfileDashboard />} />
            <Route path="/Event" element={<EventListing />} />
            <Route path="/organize" element={<EventCreationForm />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
