'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI, PARENT_DOMAIN } from '@/lib/config';

export function SubdomainSearch() {
  const [label, setLabel] = useState('');
  const [searchedLabel, setSearchedLabel] = useState('');
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending: isWriting } = useWriteContract();

  // Check if subdomain is available
  const { data: isAvailable, isLoading: isCheckingAvailability, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'isAvailable',
    args: searchedLabel ? [searchedLabel] : undefined,
    query: {
      enabled: !!searchedLabel,
    },
  });

  // Get rental info if not available
  const { data: rentalInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRentalInfo',
    args: searchedLabel ? [searchedLabel] : undefined,
    query: {
      enabled: !!searchedLabel && isAvailable === false,
    },
  });

  // Get rental price
  const { data: rentalPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'rentalPrice',
  });

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSearch = () => {
    const cleanLabel = label.trim().toLowerCase();
    if (!cleanLabel) {
      alert('Please enter a subdomain name');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(cleanLabel) || cleanLabel.startsWith('-') || cleanLabel.endsWith('-')) {
      alert('Invalid subdomain. Use only lowercase letters, numbers, and hyphens (not at start/end)');
      return;
    }
    setSearchedLabel(cleanLabel);
  };

  const handleRent = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!rentalPrice) {
      alert('Unable to fetch rental price');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'rentSubname',
        args: [searchedLabel, address],
        value: rentalPrice,
      });
    } catch (error) {
      console.error('Error renting subdomain:', error);
      alert('Transaction failed. Please try again.');
    }
  };

  const formatExpiryDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Search Box */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-purple-600 mb-6">Search & Rent Subdomain</h2>
        
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter subdomain (e.g., alice, bob, myproject)"
            className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg text-gray-900 placeholder:text-gray-400"
          />
          <span className="text-xl font-semibold text-purple-600">.{PARENT_DOMAIN}</span>
        </div>

        <button
          onClick={handleSearch}
          disabled={isCheckingAvailability || !label.trim()}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
        </button>
      </div>

      {/* Results */}
      {searchedLabel && !isCheckingAvailability && (
        <div className={`rounded-2xl shadow-xl p-8 ${
          isAvailable 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {searchedLabel}.{PARENT_DOMAIN}
              </h3>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              isAvailable 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {isAvailable ? '✓ Available' : '✗ Unavailable'}
            </span>
          </div>

          {isAvailable ? (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6 bg-white/50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-bold text-lg">{rentalPrice ? formatEther(rentalPrice) : '0.001'} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-bold text-lg">1 Year</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Renewable</p>
                  <p className="font-bold text-lg">Yes</p>
                </div>
              </div>

              {isConfirmed ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <h4 className="text-xl font-bold text-green-600 mb-2">Success!</h4>
                  <p className="text-gray-700 mb-4">
                    You now own <span className="font-bold">{searchedLabel}.{PARENT_DOMAIN}</span>
                  </p>
                  <div className="flex gap-3 justify-center">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      View Transaction
                    </a>
                    <span className="text-gray-400">•</span>
                    <a
                      href={`https://app.ens.domains/${searchedLabel}.${PARENT_DOMAIN}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      Manage on ENS
                    </a>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRent}
                  disabled={!isConnected || isWriting || isConfirming}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isConfirming 
                    ? 'Confirming Transaction...' 
                    : isWriting 
                    ? 'Waiting for Approval...' 
                    : !isConnected
                    ? 'Connect Wallet to Rent'
                    : `Rent ${searchedLabel}.${PARENT_DOMAIN}`
                  }
                </button>
              )}
            </>
          ) : rentalInfo ? (
            <div className="grid grid-cols-3 gap-4 bg-white/50 rounded-lg p-4">
              <div>
                <p className="text-sm text-gray-600">Owner</p>
                <p className="font-mono text-sm font-bold">
                  {rentalInfo[0].slice(0, 6)}...{rentalInfo[0].slice(-4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expires</p>
                <p className="font-bold">{formatExpiryDate(rentalInfo[1])}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-bold">{rentalInfo[2] ? 'Active' : 'Expired'}</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Loading state during transaction */}
      {(isWriting || isConfirming) && !isConfirmed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">
              {isConfirming ? 'Processing Transaction...' : 'Waiting for Approval...'}
            </h3>
            <p className="text-gray-600">
              {isConfirming 
                ? 'Please wait while the transaction is being confirmed on the blockchain.' 
                : 'Please approve the transaction in your wallet.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
