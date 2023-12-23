import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from "ethers";
import { shipABI, shipAddress } from '@/components/Contracts/ShipContract';
import { config, blockchainData } from '@imtbl/sdk';

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

            const client = new blockchainData.BlockchainData({
                baseConfig: {
                    environment: config.Environment.SANDBOX,
                },
            });

            const refreshNFTMetadata = async (
                client: blockchainData.BlockchainData,
                chainName: string,
                contractAddress: string,
            ) => {
                try {
                    await client.refreshNFTMetadata({
                        chainName,
                        contractAddress,
                        refreshNFTMetadataByTokenIDRequest: {
                            nft_metadata: [
                                {
                                    name: "Level 1 Ship",
                                    animation_url: null,
                                    image: "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmdPYE429FKwFYjqUeYN3jG1ncgwuhb3744VdPBLweEm51/",
                                    external_url: null,
                                    youtube_url: null,
                                    description: "This NFT represents your ship at level 1. Also, it's your profile ship.",
                                    attributes: [
                                        { trait_type: "Level", value: "1" },
                                    ],
                                    token_id: TOKEN_ID.toString(),
                                },
                            ],
                        },
                    });
                } catch (error) {
                    console.error('Error refreshing NFT metadata:', error);
                }
            };

            await refreshNFTMetadata(client, 'imtbl-zkevm-testnet', shipAddress);

            return res.status(200).json({ message: "Minted successfully.", entry: receipt });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error Minting." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
