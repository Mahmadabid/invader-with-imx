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
    userProvider: 'metamask' | 'passport';
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
        const { id, level, userProvider } = req.body;

        if (!id || !level || !userProvider) {
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

                const NftMetadata = (levels: string, tokenId: string) => { 
                    return [
                    {
                        name: `Level ${levels} Ship`,
                        animation_url: null,
                        image: parseInt(levels) === 2? "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmZK7p8KTitDc1vxz23Xd83Ddo7jxrnebsjf8FKhc3AQh6/": 'https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmTqceHT2tadsC89vFimny7Y5Di8DnQ2mdASodYzMsytCR/',
                        external_url: null,
                        youtube_url: null,
                        description: `This NFT represents your ship at level ${levels}. Also, it's your profile ship.`,
                        attributes: [
                            {
                                trait_type: "Level",
                                value: levels
                            }
                        ],
                        token_id: tokenId,
                    },
                ] }

                const refreshNFTMetadata = async (
                    client: blockchainData.BlockchainData,
                    chainName: string,
                    contractAddress: string,
                    ID: string,
                    shipLevel: string,
                ) => {
                    await client.refreshNFTMetadata({
                        chainName,
                        contractAddress,
                        refreshNFTMetadataByTokenIDRequest: {
                            nft_metadata: NftMetadata(shipLevel, ID),
                        },
                    });
                };

                await refreshNFTMetadata(client, "imtbl-zkevm-testnet", shipAddress, id, Level)

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
