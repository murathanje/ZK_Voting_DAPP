"use client";
import React from 'react';

const LandingPage = () => {
    return (
        <div className="min-h-[calc(100vh-88px)] w-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute inset-0 flex justify-around items-center opacity-20">
                <div className="bg-gradient-to-br from-pink-400 to-indigo-400 rounded-full h-96 w-96 animate-pulse"></div>
                <div className="bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full h-64 w-64 animate-pulse"></div>
                <div className="bg-gradient-to-br from-indigo-400 to-pink-400 rounded-full h-80 w-80 animate-pulse"></div>
            </div>

            <div className="z-10 text-center">
                <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-8 animate-fade-in-down">
                    ShadowVote
                </h1>
                <p className="text-2xl text-gray-200 font-light mb-12 max-w-2xl animate-fade-in-up">
                    An innovative platform for a secure, transparent, and decentralized voting experience.
                </p>
                <button className="py-4 px-8 text-xl font-semibold rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                    Explore
                </button>
            </div>

            {/* Scroll animation */}
            <div className="absolute bottom-8 flex justify-center items-center">
                <div className="text-gray-300 text-sm animate-bounce">
                    Scroll for more <br />
                    ↓
                </div>
            </div>
        </div>
    );
};

export default LandingPage;