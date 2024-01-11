import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { shipABI, shipAddress } from '@/components/Contracts/ShipContract';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { getKeyId } from '@/components/key';

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

type Entry = {
    address: string;
    userProvider: 'metamask' | 'passport'
};

type RequestBody = {
    address: string;
    userProvider: 'metamask' | 'passport'
}

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

        const { address, userProvider } = req.body as RequestBody;

        if (!address || !userProvider) {
            return res.status(400).json({ error: "Required fields are missing." });
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
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error Minting." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
