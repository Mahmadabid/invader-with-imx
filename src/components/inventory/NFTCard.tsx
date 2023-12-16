interface NFTCardProps {
    nftData: NFTProps;
}

export interface NFTProps {
    "animation_url": string | null,
    "balance": "1",
    "chain": {
        "id": "eip155:13473",
        "name": "imtbl-zkevm-testnet"
    },
    "contract_address": "0x6b8f763b171acf4521a13c8382b3b4bf145507a7",
    "contract_type": "erc721",
    "description": string | null,
    "external_link": string | null,
    "image": string | null,
    "indexed_at": "2023-12-15T06:28:11.617285Z",
    "metadata_id": "018c6c0e-65f7-bada-be46-8c6e63dd6d9c",
    "metadata_synced_at": "2023-12-15T06:28:13.180505Z",
    "name": string | null,
    "token_id": "8",
    "updated_at": "2023-12-15T06:28:13.180505Z",
    "youtube_url": string | null
}

const NFTCard: React.FC<NFTCardProps> = ({ nftData }) => {

    return (
        <div className="border rounded p-4 m-4 max-w-64 max-h-64">
            <img src={nftData.image || '/IPX.png'} alt={nftData.name || 'NFT Image'} width={150} height={150} />
            <h2 className="text-xl font-bold mt-2">{nftData.name || 'Unnamed NFT'}</h2>
            <button className="hover:bg-blue-500 text-white px-4 py-2 mt-2 bg-blue-600 rounded">Button</button>
        </div>
    );
};

export default NFTCard;