import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'divi.eth Subdomain Rental',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '0ac33b949b1f7478772c8307ab2b7bf9', // Temporary demo ID
  chains: [sepolia],
  ssr: true,
});
