import connectDb from "@/utils/db/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';
import Invader from "@/utils/db/model";
import { ethers } from "ethers";
import { gameTokenABI, gameTokenAddress } from "@/components/Contracts/TokenContract";
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { getKeyId } from "@/components/key";

const getPublicKey = async () => {
    const client = jwksClient({ jwksUri: 'https://auth.immutable.com/.well-known/jwks.json' });

    const key = await getKeyId();

    return new Promise<string>((resolve, reject) => {
        const keyId = key;

        client.getSigningKey(keyId, (err, key) => {
            if (err) {
                reject(err);
            } else {
                const signingKey = key?.getPublicKey();
                if (signingKey) {
                    resolve(signingKey);
                }
            }
        });
    });
};

const verifyJwt = async (token: string) => {
    try {
        const publicKey: string = await getPublicKey();

        return new Promise((resolve, reject) => {
            jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching public key:', error);
        throw new Error('Failed to verify JWT');
    }
};

type IPXEntry = {
    userId: string;
    data: {
        IPX: number;
        Address: string;
    };
    userProvider: 'metamask' | 'passport';
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
        const { userId, data, userProvider } = req.body as IPXEntry;

        if (!userId || !data || !userProvider) {
            return res.status(400).json({ error: "Required fields are missing." });
        }

        const IPXData = {
            IPX: data.IPX,
        }

        try {
            if (req.headers.authorization) {

                if (userProvider === 'passport') {
                    const decodedToken = await verifyJwt(req.headers.authorization.split(' ')[1]);
                    if (!decodedToken) {
                        return res.status(401).json({ error: 'Unauthorized' });
                    }
                }

                if (userProvider === 'metamask') {
                    if (process.env.JWT !== req.headers.authorization.split(' ')[1]) {
                        return res.status(401).json({ error: 'Unauthorized' });
                    }
                }

                const existingEntry = await Invader.findOne({ userId });

                if (existingEntry) {
                    if (existingEntry.data.IPX < data.IPX) return res.status(401).json({ error: 'Invalid Amount' });

                    const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.immutable.com');
                    const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);

                    const contract = new ethers.Contract(gameTokenAddress, gameTokenABI, wallet);

                    const deploymentOptions = { gasPrice: ethers.utils.parseUnits('10', 'gwei') };

                    const IpxEther = (data.IPX * 80) / 100;

                    const transaction = await contract.mintByClaimAddress(data.Address, ethers.utils.parseUnits(IpxEther.toString()), deploymentOptions);
                    await transaction.wait();

                    const SendIPX = {
                        IPX: existingEntry.data.IPX - IPXData.IPX,
                        Address: data.Address,
                    }

                    Object.assign(existingEntry.data, SendIPX);
                    await existingEntry.save();
                }

                return res.status(200).json({ message: "Data saved successfully.", entry: existingEntry });
            }
            return res.status(401).json({ error: 'Unauthorized' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error saving data." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
