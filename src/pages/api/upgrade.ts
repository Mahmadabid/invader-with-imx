import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { config, blockchainData } from '@imtbl/sdk';
import { shipAddress, shipABI } from "@/components/Contracts/ShipContract";
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

const client = new blockchainData.BlockchainData({
    baseConfig: {
        environment: config.Environment.SANDBOX,
        apiKey: process.env.API_KEY,
        publishableKey: process.env.NEXT_PUBLIC_PUBLISH_KEY,
    },
});

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
            if (req.headers.authorization) {
                const decodedToken = await verifyJwt(req.headers.authorization.split(' ')[1]);

                if (!decodedToken) return res.status(401).json({ error: 'Unauthorized' });

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

                const refreshNFTMetadata = async (
                    client: blockchainData.BlockchainData,
                    chainName: string,
                    contractAddress: string,
                    ID: string,
                ) => {
                    await client.refreshNFTMetadata({
                        chainName,
                        contractAddress,
                        refreshNFTMetadataByTokenIDRequest: {
                            nft_metadata: [
                                {
                                    name: "Level 2 Ship",
                                    animation_url: null,
                                    image: "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmWKtaHa5jQYfto46HSaCUjbKRGs7nMh5r4tzVYMFtK1vh/",
                                    external_url: null,
                                    youtube_url: null,
                                    description: "This NFT represents your ship at level 2. Also, it's your profile ship.",
                                    attributes: [
                                        {
                                            trait_type: "Level",
                                            value: "2"
                                        }
                                    ],
                                    token_id: ID,
                                },
                            ],
                        },
                    });
                };

                await refreshNFTMetadata(client, "imtbl-zkevm-testnet", shipAddress, id)

                return res.status(200).json({ message: "Upgraded successfully.", entry: receipt });
            }
            return res.status(401).json({ error: 'Unauthorized' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error Upgrading." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
