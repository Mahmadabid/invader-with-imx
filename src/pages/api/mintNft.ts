import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { ERC721Client } from "@imtbl/contracts";

type Entry = {
    address: string
};

type ApiResponse = {
    error?: string;
    message?: string;
    entry?: any;
    entries?: Entry[];
};

const CONTRACT_ADDRESS = '0x154339b6b882b9076ee90a25a142f116135c3e28';

const CONTRACT_ABI = [
    'function grantRole(bytes32 role, address account)',
    'function MINTER_ROLE() view returns (bytes32)',
    'function mint(address to, uint256 tokenId)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function hasRole(bytes32 role, address account) view returns (bool)',
    'function totalSupply() view returns (uint256)'
];

async function getNextTokenId(contract: any) {
    try {
        const totalSupply = await contract.totalSupply();
        return totalSupply.toNumber() + 1;
    } catch (error) {
        console.error('Error getting next token ID:', error);
        return null;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {

    if (req.method === 'POST') {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ error: "Required fields are missing." });
        }

        try {
            const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.immutable.com');
            const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);

            const contract = new ERC721Client(CONTRACT_ADDRESS);

            // const adjustedGasPrice = {
            //     maxPriorityFeePerGas: 100e9, // 100 Gwei
            //     maxFeePerGas: 150e9,
            //     gasLimit: 200000,
            // };

            const TOKEN_ID = await getNextTokenId(contract);

            // const tx = await contract.mint(address, 10, adjustedGasPrice);

            const requests = [
                {
                  to: address,
                  tokenIds: [15],
                },
                ];
            
              const gasOverrides = {
                maxPriorityFeePerGas: 100e9, // 100 Gwei
                maxFeePerGas: 150e9,
                gasLimit: 200000,
                };
            
            //   const tx = await contract.populateMintBatch(requests, gasOverrides);

            // const receipt = await tx.wait();
            const populatedTransaction = await contract.populateMintBatch(requests, gasOverrides);

            const result = await wallet.sendTransaction(populatedTransaction);
            console.log("Transaction sent, result:", result);

            return res.status(200).json({ message: "Minted successfully.", entry: result });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error Minting." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
