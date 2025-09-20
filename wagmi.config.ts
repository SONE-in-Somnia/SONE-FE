import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import * as wagmiChains from '@wagmi/chains'
import { Abi } from 'viem'

import PrizePool from './src/abi/PrizePool.json'
import PrizePoolManager from './src/abi/PrizePoolManager.json'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'PrizePool',
      abi: PrizePool as Abi,
    },
    {
      name: 'PrizePoolManager',
      abi: PrizePoolManager as Abi,
    },
  ],
  plugins: [react()],
})
