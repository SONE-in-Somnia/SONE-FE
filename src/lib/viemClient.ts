
import { createPublicClient, http } from 'viem';
import { defineChain } from 'viem/chains';

export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://shannon-explorer.somnia.network/' },
  },
});

export const viemClient = createPublicClient({
  chain: somniaTestnet,
  transport: http(),
});
