'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SubdomainSearch } from '@/components/SubdomainSearch';
import { RentalInfo } from '@/components/RentalInfo';
import { OffchainSubdomainSearch } from '@/components/OffchainSubdomainSearch';
import { PARENT_DOMAIN } from '@/lib/config';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">🌐 {PARENT_DOMAIN}</h1>
            <p className="text-purple-200 text-lg">Rent your ENS subdomain</p>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-8">
        <SubdomainSearch />
        <RentalInfo />

        {/* Offchain Sub-subdomain Section */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="border-t border-white/20 my-8"></div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">Offchain Sub-subdomains</h2>
          <p className="text-purple-200 text-center mb-8">
            Register sub-subdomains under rented names — free, no gas, resolved via CCIP-Read
          </p>
        </div>
        <OffchainSubdomainSearch />

        {/* Info Section */}
        <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4">How it works</h3>
          <ol className="space-y-3 text-purple-100">
            <li className="flex items-start">
              <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
              <span>Connect your wallet (MetaMask, Coinbase, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
              <span>Search for your desired subdomain name</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
              <span>If available, rent it for 0.001 ETH per year</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
              <span>Manage your subdomain on ENS Manager</span>
            </li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-white/80">
        <p className="mb-2">Built with ❤️ for ENS on Sepolia</p>
        <a 
          href="https://sepolia.etherscan.io/address/0xa589676a3a68824774Dce210f3448cE1750f676e"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-200 hover:text-white hover:underline"
        >
          View Contract on Etherscan
        </a>
      </footer>
    </div>
  );
}
