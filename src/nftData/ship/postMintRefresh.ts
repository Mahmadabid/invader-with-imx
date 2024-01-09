import { ethers } from "ethers";
import { blockchainData } from '@imtbl/sdk';
import { shipAddress, shipABI } from "../../components/Contracts/ShipContract";
import { client, PrivateKey } from "../utils";

const PostMintRefresh = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.immutable.com');
    const privateKey = PrivateKey;

    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(shipAddress, shipABI, wallet);

    const IDLevels = await contract.getAllTokenLevelsAndIds();

    const refreshNFTMetadata = async (
        client: blockchainData.BlockchainData,
        chainName: string,
        contractAddress: string,
        id: string,
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
                        token_id: id,
                    },
                ],
            },
        });
    };

    for (let i = 0; i < IDLevels[0].length; i++) {
        const level = IDLevels[1][i].toString();

        if (parseInt(level) === 2) {
            refreshNFTMetadata(client, "imtbl-zkevm-testnet", shipAddress, IDLevels[0][i].toString())
        }
    }
}

PostMintRefresh();