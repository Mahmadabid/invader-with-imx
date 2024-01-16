import { useGameConstants } from "@/components/game/gameConstants";
import { SpaceInvader } from "@/components/game/space-invader";
import { NFTProps } from "@/components/inventory/NFTCard";
import { useJWT } from "@/components/key";
import Load from "@/components/utils/Load";
import { UserContext } from "@/utils/Context";
import { UserProvider, getMetamaskSub, getNftByCollection, passportInstance } from "@/utils/immutable";
import { useContext, useEffect, useState } from "react";

const Home = () => {

  const [NFTstate, setNFTstate] = useState<NFTProps[] | undefined>([]);
  const [NFTPowerupsstate, setNFTPowerupsstate] = useState<NFTProps[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [shipLoading, setShipLoading] = useState(false);
  const [Address, setAddress] = useState('');
  const [Levels, setLevels] = useState(1);
  const { gameConst, setGameConst } = useGameConstants();
  const [User, _] = useContext(UserContext);

  const userProvider = UserProvider();

  const jwt = useJWT(userProvider);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const NftwithAddress = await getNftByCollection(User);
        const NftByAddress: NFTProps[] | undefined = NftwithAddress?.responseResult;
        const NftPowerupsByAddress: NFTProps[] | undefined = NftwithAddress?.PowerupsResult;

        setAddress(NftwithAddress?.accountAddress);
        setNFTstate(NftByAddress);
        setNFTPowerupsstate(NftPowerupsByAddress);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const getUserID = async () => {
    try {
      if (User === 'passport') {
        const userProfile = await passportInstance.getUserInfo();
        setGameConst((prevGameConst) => ({
          ...prevGameConst,
          userId: userProfile?.sub || ''
        }));
      }
      if (User === 'metamask') {
        const userProfile = await getMetamaskSub();
        setGameConst((prevGameConst) => ({
          ...prevGameConst,
          userId: userProfile || ''
        }));
      }
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
      Address: Address
    }));
  }, [Address])

  const extractLevels = (Name: string) => {
    const matches = Name.match(/\d+/);
    return matches ? parseInt(matches[0], 10) : 1;
  };

  useEffect(() => {
    const shipLevel = NFTstate?.filter((nft) => {
      const Level = extractLevels(nft.name || 'Level 1 Ship')
      setLevels(Level)
    });

    if (shipLevel) {
      setGameConst((prevGameConst) => ({
        ...prevGameConst,
        Level: Levels,
      }));
    }
  }, [NFTstate, Levels])

  useEffect(() => {
    const healthNFTPowerups = NFTPowerupsstate?.filter((nft) => nft.name === 'Extra Health');

    if (healthNFTPowerups && healthNFTPowerups.length > 0) {
      setGameConst((prevGameConst) => ({
        ...prevGameConst,
        Health: 4,
      }));
    }

    const fireNFTPowerups = NFTPowerupsstate?.filter((nft) => nft.name === 'Faster Firing');

    if (fireNFTPowerups && fireNFTPowerups.length > 0) {
      setGameConst((prevGameConst) => ({
        ...prevGameConst,
        fireSpeed: 100,
      }));
    }

    const enemyFireNFTPowerups = NFTPowerupsstate?.filter((nft) => nft.name === 'Slower Enemy Firing');

    if (enemyFireNFTPowerups && enemyFireNFTPowerups.length > 0) {
      setGameConst((prevGameConst) => ({
        ...prevGameConst,
        enemyFire: 0.005,
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

  
  const dataToSend = {
    address: Address,
    userProvider: User
  };

  const sendData = async () => {
    try {
      setShipLoading(true);
      const response = await fetch('/api/mintNft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt.accessToken}`
        },
        body: JSON.stringify(dataToSend)
      });

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
          <h1 className="text-xl font-medium text-white">{shipLoading ? 'Minting your ship' : 'Fetching your ship'}</h1>
          <Load className="w-8 h-8 my-3 fill-white" />
        </div>
      ) : (
        <div>
          <SpaceInvader User={User} gameConst={gameConst} levels={Levels.toString()} setGameConst={setGameConst} />
        </div>
      )}
    </div>
  );
};

export default Home;
