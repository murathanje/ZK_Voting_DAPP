"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import * as snarkjs from 'snarkjs';
import config from '../getJson/config.json';

const VotingComponent = () => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [contract, setContract] = useState(null);
    const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const [message, setMessage] = useState(null);
    const [isVoting, setIsVoting] = useState(false); // Voting status for animation

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

    const { abi } = config;

    useEffect(() => {
        const init = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setIsMetaMaskConnected(true);
                    setUserAddress(accounts[0]);
                    initContract();
                } catch (error) {
                    console.error('Failed to connect to MetaMask:', error);
                    setMessage('Failed to connect to MetaMask. Please check your MetaMask wallet.');
                    setIsMetaMaskConnected(false);
                }
            } else {
                console.error('MetaMask not detected');
                setMessage('MetaMask is not installed. Please install MetaMask to use this application.');
            }
        };

        const initContract = async () => {
            try {
                const provider = new ethers.JsonRpcProvider(rpcUrl);
                const signer = new ethers.Wallet(privateKey, provider);
                const votingContract = new ethers.Contract(contractAddress, abi, signer);
                setContract(votingContract);

                const voteCounts = await votingContract.getAllOptions();
                const optionsArray = voteCounts.map(count => ({
                    voteCount: Number(count)
                }));
                setOptions(optionsArray);
            } catch (error) {
                console.error('Error initializing contract:', error);
                setMessage('An error occurred while initializing the contract. Please check the settings.');
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
                address: BigInt('0x' + userAddress.slice(2)),
                option: BigInt(selectedOption),
                nullifier: nullifier
            };

            const wasmFile = '/circuits/vote_js/vote.wasm';
            const zkeyFile = '/circuits/vote_0001.zkey';

            const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmFile, zkeyFile);

            const a = [proof.pi_a[0], proof.pi_a[1]];
            const b = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]];
            const c = [proof.pi_c[0], proof.pi_c[1]];

            const tx = await contract.vote(a, b, c, publicSignals);
            await tx.wait();

            setMessage('Vote successfully cast');
        } catch (error) {
            console.error('Voting error:', error);
            setMessage(error.reason || 'An error occurred while voting.');
        } finally {
            setIsVoting(false); 
        }
    };

    const closeModal = () => {
        setMessage(null);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 transform transition duration-500 hover:scale-102">
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-center mb-10">
                Cast Your Vote
            </h2>

            <div className="space-y-6">
                {options.map((option, index) => (
                    <div key={index} className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
                        <label htmlFor={`option-${index}`} className="text-gray-200 font-medium text-lg">
                            Option {index + 1} (Vote Count: {option.voteCount})
                        </label>
                        <input
                            type="radio"
                            id={`option-${index}`}
                            name="voteOption"
                            value={index}
                            onChange={() => setSelectedOption(index)}
                            className="form-radio h-6 w-6 text-indigo-400 focus:ring-indigo-500 transition duration-300"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleVote}
                disabled={!isMetaMaskConnected || isVoting}
                className={`w-full mt-10 py-4 rounded-full text-lg font-semibold shadow-lg transition duration-500 ease-in-out transform hover:scale-105 ${isVoting ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed' :
                        isMetaMaskConnected ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500' :
                            'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
            >
                {isVoting ? 'Voting...' : (isMetaMaskConnected ? 'Vote' : 'MetaMask Not Connected')}
            </button>

            {/* Modal code will remain the same, only style updates will be made */}
            {message && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className={`bg-gray-900 p-8 rounded-3xl shadow-2xl max-w-md w-full transform transition duration-500 ${message.includes('successfully cast') ? 'border-green-500' : 'border-red-500'} border-4`}>
                        <h3 className={`text-2xl font-bold mb-4 text-center ${message.includes('successfully cast') ? 'text-green-400' : 'text-red-400'}`}>
                            {message.includes('successfully cast') ? 'Successful!' : 'Error!'}
                        </h3>
                        <p className="text-gray-300 text-center mb-6">{message}</p>
                        <button
                            onClick={closeModal}
                            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VotingComponent;
