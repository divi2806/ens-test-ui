'use client';

import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/config';

export function RentalInfo() {
  const { data: rentalPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'rentalPrice',
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-purple-800 mb-6">Rental Details</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-purple-600 font-medium mb-1">Price</p>
            <p className="text-2xl font-bold text-gray-800">
              {rentalPrice ? formatEther(rentalPrice) : '0.001'} ETH
            </p>
            <p className="text-xs text-gray-500">per year</p>
          </div>
          
          <div>
            <p className="text-sm text-purple-600 font-medium mb-1">Duration</p>
            <p className="text-2xl font-bold text-gray-800">1 Year</p>
            <p className="text-xs text-gray-500">365 days</p>
          </div>
          
          <div>
            <p className="text-sm text-purple-600 font-medium mb-1">Network</p>
            <p className="text-2xl font-bold text-gray-800">Sepolia ETH</p>
            <p className="text-xs text-gray-500">Testnet</p>
          </div>
          
          <div>
            <p className="text-sm text-purple-600 font-medium mb-1">Contract</p>
            <p className="text-lg font-mono font-bold text-gray-800">
              {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
            </p>
            <a 
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-600 hover:underline"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
