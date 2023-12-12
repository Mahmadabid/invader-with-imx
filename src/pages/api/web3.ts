import connectDb from "@/utils/db/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';
import Invader from "@/utils/db/model";
import { ethers } from "ethers";
import { gameTokenABI, gameTokenAddress } from "@/components/Contracts/TokenContract";

type IPXEntry = {
    userId: string;
    data: {
        IPX: number;
        Address: string;
    };
};

type ApiResponse = {
    error?: string;
    message?: string;
    entry?: IPXEntry;
    entries?: IPXEntry[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    await connectDb();

    if (req.method === 'POST') {
        const { userId, data } = req.body as IPXEntry;

        if (!userId || !data) {
            return res.status(400).json({ error: "Required fields are missing." });
        }

        const IPXData = {
            IPX: data.IPX,
        }

        try {
            const existingEntry = await Invader.findOne({ userId });
            
            const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.immutable.com');
            const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);

            const contract = new ethers.Contract(gameTokenAddress, gameTokenABI, wallet);

            const deploymentOptions = { gasPrice: ethers.utils.parseUnits('10', 'gwei') };

            const transaction = await contract.mintByClaimAddress(data.Address, ethers.utils.parseUnits(data.IPX.toString()), deploymentOptions);
            await transaction.wait();

            if (existingEntry) {
                const SendIPX = {
                    IPX: existingEntry.data.IPX - IPXData.IPX,
                    Address: data.Address,
                }

                Object.assign(existingEntry.data, SendIPX);
                await existingEntry.save();
            }

            return res.status(200).json({ message: "Data saved successfully.", entry: existingEntry });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error saving data." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
