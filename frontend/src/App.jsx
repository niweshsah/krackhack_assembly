import React from 'react';  // Ensure React is imported
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import EventListing from './Events';
import EventCreationForm from './CreateEvent';
import ProfileDashboard from './ProfilePage';
import SignInWindow from './SignIn';
import SignUpWindow from './SignUp';
import { useSelector } from 'react-redux';
function App() {
  const {isAuthenticated} = useSelector((state) => state.user)
  return (
    <Router>
      
      <div className="flex flex-col min-h-screen">
        
        <Header isSignedIn = {isAuthenticated}/>
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInWindow />} />
            {/* <Route path="/signup" element={<SignInWindow />} /> */}
            <Route path="/signup" element={isAuthenticated ? <ProfileDashboard /> : <SignUpWindow/>} />
            <Route path="/profile" element={<ProfileDashboard />} />
            <Route path="/event" element={<EventListing />} />
            <Route path="/organize" element={<EventCreationForm />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
