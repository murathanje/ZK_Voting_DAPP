"use client";

import React, { useState } from 'react';
import VotingComponent from '../components/VotingComponent';
import LandingPage from '../components/LandingPage';

function App() {
  const [showVoting, setShowVoting] = useState(false);

  const toggleComponent = () => {
    setShowVoting(!showVoting);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Navigation section */}
      <nav className="w-full flex justify-between items-center p-6 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg">
        {/* ShadowVote logo */}
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
          ShadowVote
        </h1>

        <button
          onClick={toggleComponent}
          className="py-2 px-6 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
        >
          {showVoting ? 'Home' : 'Vote'}
        </button>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {showVoting ? <VotingComponent /> : <LandingPage />}
      </main>
    </div>
  );
}

export default App;