import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizePool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const prizePoolAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      {
        name: '_yieldProtocolAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_poolManagerAddress', internalType: 'address', type: 'address' },
      { name: '_drawDeadline', internalType: 'uint256', type: 'uint256' },
      { name: '_depositDeadline', internalType: 'uint256', type: 'uint256' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldDepositDeadline',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newDepositDeadline',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositDeadlineUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldDrawTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newDrawTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DrawTimeUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'winner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'WinnerDrawn',
  },
  {
    type: 'function',
    inputs: [],
    name: 'count',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositDeadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'depositTimes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'deposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'drawTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'drawWinner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getWinRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWinner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'index',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isWinner',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'prizePoolManager',
    outputs: [
      { name: '', internalType: 'contract IPrizePoolManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalInterest',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalWeightedTickets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newDepositDeadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateDepositDeadline',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newDrawTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateDrawTime',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'v',
    outputs: [{ name: '', internalType: 'contract VaultAPI', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'weightedTickets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'winner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'yieldProtocolAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizePoolManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const prizePoolManagerAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'prizePoolAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'yieldProtocolAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'symbol',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'depositionDeadline',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'withdrawalTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PrizePoolCreated',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      {
        name: 'yieldProtocolAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'drawTime', internalType: 'uint256', type: 'uint256' },
      { name: 'depositDeadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createPrizePool',
    outputs: [
      { name: '', internalType: 'contract PrizePool', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fetchPools',
    outputs: [
      {
        name: '',
        internalType: 'struct PrizePoolManager.PrizePoolStruct[]',
        type: 'tuple[]',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          {
            name: 'prizePoolAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
          {
            name: 'yieldProtocolAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'depositionDeadline',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'withdrawalTime', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'prizePools',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'prizePoolAddress', internalType: 'address', type: 'address' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      {
        name: 'yieldProtocolAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: 'depositionDeadline', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawalTime', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__
 */
export const useReadPrizePool = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"count"`
 */
export const useReadPrizePoolCount = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'count',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"depositDeadline"`
 */
export const useReadPrizePoolDepositDeadline =
  /*#__PURE__*/ createUseReadContract({
    abi: prizePoolAbi,
    functionName: 'depositDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"depositTimes"`
 */
export const useReadPrizePoolDepositTimes = /*#__PURE__*/ createUseReadContract(
  { abi: prizePoolAbi, functionName: 'depositTimes' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"deposits"`
 */
export const useReadPrizePoolDeposits = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'deposits',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"drawTime"`
 */
export const useReadPrizePoolDrawTime = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'drawTime',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"getWinRate"`
 */
export const useReadPrizePoolGetWinRate = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'getWinRate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"getWinner"`
 */
export const useReadPrizePoolGetWinner = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'getWinner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"index"`
 */
export const useReadPrizePoolIndex = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'index',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"isWinner"`
 */
export const useReadPrizePoolIsWinner = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'isWinner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"owner"`
 */
export const useReadPrizePoolOwner = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"prizePoolManager"`
 */
export const useReadPrizePoolPrizePoolManager =
  /*#__PURE__*/ createUseReadContract({
    abi: prizePoolAbi,
    functionName: 'prizePoolManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"token"`
 */
export const useReadPrizePoolToken = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'token',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"totalDeposits"`
 */
export const useReadPrizePoolTotalDeposits =
  /*#__PURE__*/ createUseReadContract({
    abi: prizePoolAbi,
    functionName: 'totalDeposits',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"totalInterest"`
 */
export const useReadPrizePoolTotalInterest =
  /*#__PURE__*/ createUseReadContract({
    abi: prizePoolAbi,
    functionName: 'totalInterest',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"totalWeightedTickets"`
 */
export const useReadPrizePoolTotalWeightedTickets =
  /*#__PURE__*/ createUseReadContract({
    abi: prizePoolAbi,
    functionName: 'totalWeightedTickets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"v"`
 */
export const useReadPrizePoolV = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'v',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"weightedTickets"`
 */
export const useReadPrizePoolWeightedTickets =
  /*#__PURE__*/ createUseReadContract({
    abi: prizePoolAbi,
    functionName: 'weightedTickets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"winner"`
 */
export const useReadPrizePoolWinner = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolAbi,
  functionName: 'winner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"yieldProtocolAddress"`
 */
export const useReadPrizePoolYieldProtocolAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: prizePoolAbi,
    functionName: 'yieldProtocolAddress',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolAbi}__
 */
export const useWritePrizePool = /*#__PURE__*/ createUseWriteContract({
  abi: prizePoolAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"deposit"`
 */
export const useWritePrizePoolDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: prizePoolAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"drawWinner"`
 */
export const useWritePrizePoolDrawWinner = /*#__PURE__*/ createUseWriteContract(
  { abi: prizePoolAbi, functionName: 'drawWinner' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWritePrizePoolRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizePoolAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWritePrizePoolTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizePoolAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"updateDepositDeadline"`
 */
export const useWritePrizePoolUpdateDepositDeadline =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizePoolAbi,
    functionName: 'updateDepositDeadline',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"updateDrawTime"`
 */
export const useWritePrizePoolUpdateDrawTime =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizePoolAbi,
    functionName: 'updateDrawTime',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWritePrizePoolWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: prizePoolAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolAbi}__
 */
export const useSimulatePrizePool = /*#__PURE__*/ createUseSimulateContract({
  abi: prizePoolAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulatePrizePoolDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"drawWinner"`
 */
export const useSimulatePrizePoolDrawWinner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolAbi,
    functionName: 'drawWinner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulatePrizePoolRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulatePrizePoolTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"updateDepositDeadline"`
 */
export const useSimulatePrizePoolUpdateDepositDeadline =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolAbi,
    functionName: 'updateDepositDeadline',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"updateDrawTime"`
 */
export const useSimulatePrizePoolUpdateDrawTime =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolAbi,
    functionName: 'updateDrawTime',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulatePrizePoolWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolAbi}__
 */
export const useWatchPrizePoolEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: prizePoolAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolAbi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchPrizePoolClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizePoolAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolAbi}__ and `eventName` set to `"DepositDeadlineUpdated"`
 */
export const useWatchPrizePoolDepositDeadlineUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizePoolAbi,
    eventName: 'DepositDeadlineUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolAbi}__ and `eventName` set to `"Deposited"`
 */
export const useWatchPrizePoolDepositedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizePoolAbi,
    eventName: 'Deposited',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolAbi}__ and `eventName` set to `"DrawTimeUpdated"`
 */
export const useWatchPrizePoolDrawTimeUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizePoolAbi,
    eventName: 'DrawTimeUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchPrizePoolOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizePoolAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolAbi}__ and `eventName` set to `"WinnerDrawn"`
 */
export const useWatchPrizePoolWinnerDrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizePoolAbi,
    eventName: 'WinnerDrawn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolManagerAbi}__
 */
export const useReadPrizePoolManager = /*#__PURE__*/ createUseReadContract({
  abi: prizePoolManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `functionName` set to `"fetchPools"`
 */
export const useReadPrizePoolManagerFetchPools =
  /*#__PURE__*/ createUseReadContract({
    abi: prizePoolManagerAbi,
    functionName: 'fetchPools',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `functionName` set to `"owner"`
 */
export const useReadPrizePoolManagerOwner = /*#__PURE__*/ createUseReadContract(
  { abi: prizePoolManagerAbi, functionName: 'owner' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `functionName` set to `"prizePools"`
 */
export const useReadPrizePoolManagerPrizePools =
  /*#__PURE__*/ createUseReadContract({
    abi: prizePoolManagerAbi,
    functionName: 'prizePools',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolManagerAbi}__
 */
export const useWritePrizePoolManager = /*#__PURE__*/ createUseWriteContract({
  abi: prizePoolManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `functionName` set to `"createPrizePool"`
 */
export const useWritePrizePoolManagerCreatePrizePool =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizePoolManagerAbi,
    functionName: 'createPrizePool',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWritePrizePoolManagerRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizePoolManagerAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWritePrizePoolManagerTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizePoolManagerAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolManagerAbi}__
 */
export const useSimulatePrizePoolManager =
  /*#__PURE__*/ createUseSimulateContract({ abi: prizePoolManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `functionName` set to `"createPrizePool"`
 */
export const useSimulatePrizePoolManagerCreatePrizePool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolManagerAbi,
    functionName: 'createPrizePool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulatePrizePoolManagerRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolManagerAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulatePrizePoolManagerTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizePoolManagerAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolManagerAbi}__
 */
export const useWatchPrizePoolManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: prizePoolManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchPrizePoolManagerOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizePoolManagerAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizePoolManagerAbi}__ and `eventName` set to `"PrizePoolCreated"`
 */
export const useWatchPrizePoolManagerPrizePoolCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizePoolManagerAbi,
    eventName: 'PrizePoolCreated',
  })
