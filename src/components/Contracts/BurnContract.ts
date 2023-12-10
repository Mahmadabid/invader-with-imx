export const burnContractAddress = '0xB10E912D9EaAA0E8c18CEa58055e52d2F21d44Ac';

export const burnContractABI = [
  {
    "inputs": [
      {
        "internalType": "contract GameToken",
        "name": "_gameToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "stateMutability": "nonpayable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "burnRecords",
    "outputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "burnTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameToken",
    "outputs": [
      {
        "internalType": "contract GameToken",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getBurnRecordsByAddress",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalTokensBurnt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]