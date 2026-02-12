export const CONTRACT_ADDRESS = '0xa589676a3a68824774Dce210f3448cE1750f676e' as const;
export const PARENT_DOMAIN = 'divicompany.eth' as const;
export const SEPOLIA_CHAIN_ID = 11155111 as const;
export const GATEWAY_API_URL = process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3001';

export const CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'string', name: 'label', type: 'string' }, { internalType: 'address', name: 'renter', type: 'address' }],
    name: 'rentSubname',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'label', type: 'string' }],
    name: 'renewSubname',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'label', type: 'string' }],
    name: 'isAvailable',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'label', type: 'string' }],
    name: 'getRentalInfo',
    outputs: [
      { internalType: 'address', name: 'renter', type: 'address' },
      { internalType: 'uint64', name: 'expiryTime', type: 'uint64' },
      { internalType: 'bool', name: 'active', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rentalPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rentalDuration',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
