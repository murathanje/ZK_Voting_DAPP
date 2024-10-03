"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import * as snarkjs from "snarkjs";
import config from "../getJson/config.json";

const VotingComponent = () => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [contract, setContract] = useState(null);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [message, setMessage] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

  const { abi } = config;

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setIsMetaMaskConnected(true);
          setUserAddress(accounts[0]);
          initContract();
        } catch (error) {
          console.error("Failed to connect to MetaMask:", error);
          setMessage(
            "Failed to connect to MetaMask. Please check your MetaMask wallet."
          );
          setIsMetaMaskConnected(false);
        }
      } else {
        console.error("MetaMask not detected");
        setMessage(
          "MetaMask is not installed. Please install MetaMask to use this application."
        );
      }
    };

    const initContract = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const signer = new ethers.Wallet(privateKey, provider);
        const votingContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        setContract(votingContract);

        const voteCounts = await votingContract.getAllOptions();
        const optionsArray = voteCounts.map((count) => ({
          voteCount: Number(count),
        }));
        setOptions(optionsArray);
      } catch (error) {
        console.error("Error initializing contract:", error);
        setMessage(
          "An error occurred while initializing the contract. Please check the settings."
        );
      }
    };

    init();
  }, [rpcUrl, privateKey, contractAddress, abi]);

  const handleVote = async () => {
    if (selectedOption === null || !contract || !userAddress) return;

    setIsVoting(true);

    try {
      const nullifier = ethers.keccak256(userAddress);
      const input = {
        address: BigInt("0x" + userAddress.slice(2)),
        option: BigInt(selectedOption),
        nullifier: nullifier,
      };

      const wasmFile = "/circuits/vote_js/vote.wasm";
      const zkeyFile = "/circuits/vote_0001.zkey";

      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        wasmFile,
        zkeyFile
      );

      const a = [proof.pi_a[0], proof.pi_a[1]];
      const b = [
        [proof.pi_b[0][1], proof.pi_b[0][0]],
        [proof.pi_b[1][1], proof.pi_b[1][0]],
      ];
      const c = [proof.pi_c[0], proof.pi_c[1]];

      const tx = await contract.vote(a, b, c, publicSignals);
      await tx.wait();

      setMessage("Oy Başarıyla Verildi");
    } catch (error) {
      console.error("Voting error:", error);
      setMessage(error.reason || "Oy verirken bir hata gerçekleşti.");
    } finally {
      setIsVoting(false);
    }
  };

  const closeToast = () => {
    setMessage(null);
  };

  // Option list with custom labels
  const optionLabels = ["Ankara", "İstanbul", "İzmir"]; // Add your options here

  return (
    <div className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 transform transition duration-500 hover:scale-102">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-center mb-5">
        Oylamaya Katıl
      </h2>
      <h1 className=" text-center">
        Teknofest gelecek yıl hangi şehirde düzenlenmeli ?
      </h1>

      <div className="space-y-6">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            <label
              htmlFor={`option-${index}`}
              className="text-gray-800 font-bold text-lg"
            >
              {index + 1}. {optionLabels[index] || `Option ${index + 1}`}
              <br /> (Oy Sayısı: {option.voteCount})
            </label>
            <input
              type="radio"
              id={`option-${index}`}
              name="voteOption"
              value={index}
              onChange={() => setSelectedOption(index)}
              checked={selectedOption === index} // Set checked state
              className="form-radio h-6 w-6 text-red-600 focus:ring-red-500 transition duration-300"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleVote}
        disabled={!isMetaMaskConnected || isVoting}
        className={`w-full mt-10 py-4 rounded-full text-lg text-white font-semibold shadow-lg transition duration-500 ease-in-out transform hover:scale-105 ${
          isVoting
            ? "bg-gradient-to-r from-red-700 to-rose-700 cursor-not-allowed text-white"
            : isMetaMaskConnected
            ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white hover:from-red-500 hover:via-rose-500 hover:to-red-500"
            : "bg-red-700 text-white cursor-not-allowed"
        }`}
      >
        {isVoting
          ? "Voting..."
          : isMetaMaskConnected
          ? "Oy Ver"
          : "MetaMask Hesabınızı Bağlayın"}
      </button>

      {/* Toast message */}
      {message && (
        <div
          className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg transition-transform transform translate-y-0 opacity-90 ${
            message === "Oy Başarıyla Verildi" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <p className="text-white">{message}</p>
          <button
            onClick={closeToast}
            className="mt-2 text-sm underline text-white"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
};

export default VotingComponent;
