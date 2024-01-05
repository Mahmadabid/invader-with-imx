import { useGameConstants } from "@/components/game/gameConstants";
import { SpaceInvader } from "@/components/game/space-invader";
import { NFTProps } from "@/components/inventory/NFTCard";
import Load from "@/components/utils/Load";
import { getNftByCollection, passportInstance } from "@/utils/immutable";
import { useEffect, useState } from "react";

const Home = () => {

  const [NFTstate, setNFTstate] = useState<NFTProps[] | undefined>([]);
  const [NFTPowerupsstate, setNFTPowerupsstate] = useState<NFTProps[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [shipLoading, setShipLoading] = useState(false);
  const [Address, setAddress] = useState('');
  const [Levels, setLevels] = useState('1');
  const { gameConst, setGameConst } = useGameConstants();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const NftwithAddress = await getNftByCollection();
        const NftByAddress: NFTProps[] | undefined = NftwithAddress?.responseResult;
        const NftPowerupsByAddress: NFTProps[] | undefined = NftwithAddress?.PowerupsResult;
        const LevelbyID = NftwithAddress?.LevelbyTokenID;

        setAddress(NftwithAddress?.accountAddress);
        setNFTstate(NftByAddress);
        setNFTPowerupsstate(NftPowerupsByAddress);
        setLevels(LevelbyID || '1');

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


  const getUserID = async () => {
    try {
      const userProfile = await passportInstance.getUserInfo();
      setGameConst((prevGameConst) => ({
        ...prevGameConst,
        userId: userProfile?.sub || ''
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserID();
  }, []);

  useEffect(() => {
    setGameConst((prevGameConst) => ({
      ...prevGameConst,
      Level: parseInt(Levels)
    }));
  }, [Levels, SpaceInvader])

  useEffect(() => {
    setGameConst((prevGameConst) => ({
      ...prevGameConst,
      Address: Address
    }));
  }, [Address])

  useEffect(() => {
    const healthNFTPowerups = NFTPowerupsstate?.filter((nft) => nft.name === 'Extra Health');

    if (healthNFTPowerups && healthNFTPowerups.length > 0) {
      setGameConst((prevGameConst) => ({
        ...prevGameConst,
        health: 4,
      }));
    }

    const fireNFTPowerups = NFTPowerupsstate?.filter((nft) => nft.name === 'Faster Firing');

    if (fireNFTPowerups && fireNFTPowerups.length > 0) {
      setGameConst((prevGameConst) => ({
        ...prevGameConst,
        fireSpeed: 100,
      }));
    }

    const timerNFTPowerups = NFTPowerupsstate?.filter((nft) => nft.name === 'Extra Time');

    if (timerNFTPowerups && timerNFTPowerups.length > 0) {
      setGameConst((prevGameConst) => ({
        ...prevGameConst,
        timer: 35,
      }));
    }

  }, [NFTPowerupsstate]);
  

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
          <SpaceInvader gameConst={gameConst} levels={Levels} setGameConst={setGameConst} />
        </div>
      )}
    </div>
  );
};

export default Home;
