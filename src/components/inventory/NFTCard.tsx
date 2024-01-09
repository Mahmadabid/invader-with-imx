import Link from "next/link";
import { useState } from "react";
import DialogBox from "./DialogBox";

interface NFTCardProps {
    nftData: NFTProps;
    balance: number;
    points: number;
}

export interface NFTProps {
    chain: {
      id: string | null;
      name: string | null;
    };
    token_id: string | null;
    contract_address: string | null;
    indexed_at: string | null;
    metadata_synced_at: string | null;
    name: string | null;
    description: string | null;
    image: string | null;
    external_link: string | null;
    animation_url: string | null;
    youtube_url: string | null;
  }
  

const NFTCard: React.FC<NFTCardProps> = ({ nftData, balance, points }) => {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="border rounded p-4 m-4 max-w-80">
            <img src={nftData.image || '/IPX_holder.png'} alt={nftData.name || 'NFT Image'} className={`${nftData.image? '': 'opacity-30'}`} width={200} height={200} />
            <h2 className="text-xl font-bold mt-2">{nftData.name || 'Unnamed NFT'}</h2>
            <button onClick={handleClickOpen} className="hover:bg-blue-500 text-white px-4 py-2 mt-2 bg-blue-600 rounded">Action</button>
            <br/>
            <Link href={`https://explorer.testnet.immutable.com/token/${nftData.contract_address}/instance/${nftData.token_id}`} target="_blank"><button className="hover:bg-green-500 text-white px-4 py-2 mt-2 bg-green-600 rounded">Explorer</button></Link>
            {open? <DialogBox handleClose={handleClose} name={nftData.name || '1'} tokenId={nftData.token_id} balance={balance} points={points} contractAddress={nftData.contract_address} />: null}
        </div>
    );
};

export default NFTCard;