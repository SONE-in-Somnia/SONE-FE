export const wheelyWheelyABI = [
  {
    "type": "function",
    "name": "deposit",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getPlayers",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          { "name": "playerAddress", "type": "address" },
          { "name": "amount", "type": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoundDetails",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          { "name": "roundId", "type": "uint256" },
          { "name": "totalPot", "type": "uint256" },
          { "name": "endTime", "type": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  }
] as const;
