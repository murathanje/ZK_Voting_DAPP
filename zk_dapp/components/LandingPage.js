"use client";
import React, { useState } from "react";

const LandingPage = () => {
  const [isDetailed, setIsDetailed] = useState(false); // Detaylı metin durumu

  const toggleDetail = () => {
    setIsDetailed(!isDetailed); // Detayı aç/kapat
  };

  return (
    <div className="min-h-[calc(100vh-88px)] w-full flex flex-col items-center justify-center relative overflow-hidden p-4">
      <div className="z-10 text-center bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 mb-2 p-3 animate-fade-in-down">
          Gölge Oy
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light mb-12 max-w-xl mx-auto animate-fade-in-up">
          {isDetailed
            ? "Bu uygulama, kullanıcıların güvenli ve merkeziyetsiz bir şekilde oy vermesine olanak tanır. Sıfır Bilgi İspatı teknolojisi sayesinde, kimlik bilgileri gizli kalırken oylama işlemleri şeffaf bir şekilde gerçekleştirilir. Güvenlik, kullanıcı deneyimi ve erişilebilirlik odaklı bir platformdur. Ayrıca meta-transaction sayesinde kullanıcılar gas fee ödemez."
            : "Merkeziyetsiz Zero-Knowledge (Sıfır Bilgi İspatı) Oylama Uygulaması"}
        </p>
        <button
          onClick={toggleDetail} // Butona tıklama olayı
          className="py-3 px-6 text-lg sm:text-xl font-semibold rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white hover:from-red-600 hover:via-red-700 hover:to-red-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Açıklamayı {isDetailed ? "Gizle" : "Göster"} ↓
        </button>
      </div>

      {/* Scroll animation */}
      <div className="absolute bottom-1 flex justify-center items-center">
        <div className="text-gray-500 text-sm animate-bounce">
          Şimdi Oy Ver💌 ↑
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
