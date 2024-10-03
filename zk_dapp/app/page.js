"use client";

import React, { useState } from "react";
import VotingComponent from "../components/VotingComponent";
import LandingPage from "../components/LandingPage";
import Image from "next/image";

function App() {
  const [showVoting, setShowVoting] = useState(false);

  const toggleComponent = () => {
    setShowVoting(!showVoting);
  };

  return (
    <div className="min-h-screen ">
      {/* Navigation section */}
      <nav className="w-full flex justify-between items-center p-4 sm:p-6 bg-white bg-opacity-90 shadow-lg backdrop-filter backdrop-blur-lg">
        {/* gölge oy logo ve başlık */}
        <div className="flex items-center gap-2">
          {" "}
          {/* gap burada eklendi */}
          <Image
            src={"/elections.png"}
            width={40}
            height={40}
            alt="Elections Logo"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-red-600">
            Gölge Oy
          </h1>
        </div>

        <button
          onClick={toggleComponent}
          className="py-2 px-4 sm:px-6 text-sm sm:text-lg font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
        >
          {showVoting ? "Ana Sayfa" : "Oy Ver"}
        </button>
      </nav>

      <main className="flex justify-center items-center min-h-[calc(100vh-88px)]">
        <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2  m-4">
          {showVoting ? <VotingComponent /> : <LandingPage />}
        </div>
      </main>
    </div>
  );
}

export default App;
