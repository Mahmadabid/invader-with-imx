import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { shipABI, shipAddress } from '@/components/Contracts/ShipContract';

type Entry = {
    id: string;
    level: string;
};

type ApiResponse = {
    error?: string;
    message?: string;
    entry?: Entry;
    entries?: Entry[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {

    if (req.method === 'POST') {
        const { id, level } = req.body;

        if (!id || !level) {
            return res.status(400).json({ error: "Required fields are missing." });
        }

        try {

            const ID = id.toString();

            const Level = level.toString();

            const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.immutable.com');
            const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);


            const contract = new ethers.Contract(shipAddress, shipABI, wallet);

            const adjustedGasPrice = {
                maxPriorityFeePerGas: 100e9,
                maxFeePerGas: 150e9,
                gasLimit: 200000,
            };

            const tx = await contract.setTokenLevel(ID, Level, adjustedGasPrice);

            const receipt = await tx.wait();

            console.log(receipt)

            return res.status(200).json({ message: "Upgraded successfully.", entry: receipt });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error Upgrading." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
