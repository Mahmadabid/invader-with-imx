import { ethers } from "ethers";
import { blockchainData } from '@imtbl/sdk';
import { shipAddress, shipABI } from "../../components/Contracts/ShipContract";
import { PrivateKey, client } from "../utils";

const PostMintRefresh = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.immutable.com');
    const privateKey = PrivateKey;

    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(shipAddress, shipABI, wallet);

    const IDLevels = await contract.getAllTokenLevelsAndIds();

    const NftMetadata = (levels: string, tokenId: string) => { 
        return [
        {
            name: `Level ${levels} Ship`,
            animation_url: null,
            image: parseInt(levels) === 3? "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmZK7p8KTitDc1vxz23Xd83Ddo7jxrnebsjf8FKhc3AQh6/": parseInt(levels) === 4? 'https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmTqceHT2tadsC89vFimny7Y5Di8DnQ2mdASodYzMsytCR/': 'https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmRn5a6ZGXbJMhLKFomKGFBLZ8zrMyMBvgrU39tzrsUGpu/',
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
        id: string,
        shipLevel: string,
    ) => {
        return await client.refreshNFTMetadata({
            chainName,
            contractAddress,
            refreshNFTMetadataByTokenIDRequest: {
                nft_metadata: NftMetadata(shipLevel, id),
            },
        });
    };

    for (let i = 0; i < IDLevels[0].length; i++) {
        const level = IDLevels[1][i].toString();

        if (parseInt(level) === 2 || parseInt(level) === 3 || parseInt(level) === 4) {
            await refreshNFTMetadata(client, "imtbl-zkevm-testnet", shipAddress, IDLevels[0][i].toString(), level)
        }
    }
}

PostMintRefresh();