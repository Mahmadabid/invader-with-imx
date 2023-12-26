import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { shipABI, shipAddress } from '@/components/Contracts/ShipContract';

type Entry = {
    address: string
};

type ApiResponse = {
    error?: string;
    message?: string;
    entry?: Entry;
    entries?: Entry[];
};

async function getNextTokenId() {
    try {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.immutable.com');
        const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);

        const contract = new ethers.Contract(shipAddress, shipABI, wallet);

        const totalSupply = await contract.getTotalMint();
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

            const contract = new ethers.Contract(shipAddress, shipABI, wallet);

            const adjustedGasPrice = {
                maxPriorityFeePerGas: 100e9,
                maxFeePerGas: 150e9,
                gasLimit: 200000,
            };

            const TOKEN_ID = await getNextTokenId();

            const tx = await contract.mint(address, TOKEN_ID, adjustedGasPrice);

            const receipt = await tx.wait();

            return res.status(200).json({ message: "Minted successfully.", entry: receipt });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error Minting." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
