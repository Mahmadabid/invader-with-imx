import { shipAddress } from "@/components/Contracts/ShipContract";
import { useGameConstants } from "@/components/game/gameConstants";
import { SpaceInvader } from "@/components/game/space-invader";
import { NFTProps } from "@/components/inventory/NFTCard";
import Load from "@/components/utils/Load";
import { getNftByCollection } from "@/utils/immutable";
import { useEffect, useState } from "react";

const Home = () => {

  const [NFTstate, setNFTstate] = useState<NFTProps[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [shipLoading, setShipLoading] = useState(false);
  const [minted, setMinted] = useState(false);
  const [Address, setAddress] = useState('');
  const { gameConst, setGameConst } = useGameConstants();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const NftwithAddress = await getNftByCollection(shipAddress);
        const NftByAddress: NFTProps[] | undefined = NftwithAddress?.responseResult;

        setAddress(NftwithAddress?.accountAddress);
        setNFTstate(NftByAddress);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const dataToSend = {
    address: Address
  };

  const getNumber = (nftState: NFTProps[] | undefined) => {
    const match = nftState?.length && nftState[1].name?.match(/Level (\d+)/);
    const levelNumber = match ? parseInt(match[1]) : 1;
    return levelNumber;
  }
  
  const Number = getNumber(NFTstate);

  useEffect(() => {
    setGameConst((prevGameConst) => ({
      ...prevGameConst,
      Level: Number
    }));
  }, [Number, SpaceInvader])

  const sendData = async () => {
    try {
      setShipLoading(true);
      const response = await fetch('/api/mintNft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      console.log(response)
      if (response.ok) {
        console.log('Minted successfully', response);
        setMinted(true);
      } else {
        console.error('Failed to Mint. Status:', response.status);
        throw new Error('Failed to Mint');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setShipLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && NFTstate?.length === 0) {
      sendData();
    }
  }, [loading]);

  return (
    <div>
      {loading || shipLoading ? (
        <div className="flex flex-col justify-center items-center my-20">
          <h1 className="text-xl font-medium text-slate-700">{shipLoading ? 'Minting your ship' : 'Fetching your ship'}</h1>
          <Load className="w-8 h-8 my-3" />
        </div>
      ) : (
        <div>
          <SpaceInvader gameConst={gameConst} setGameConst={setGameConst} />
        </div>
      )}
    </div>
  );
};

export default Home;
