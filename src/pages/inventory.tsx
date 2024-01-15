import NFTCard, { NFTProps } from "@/components/inventory/NFTCard";
import Load from "@/components/utils/Load";
import { UserContext } from "@/utils/Context";
import { getAddress, getInventoryData, getNftByAddress } from "@/utils/immutable";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const Inventory = () => {
  const [address, setAddress] = useState("");
  const [NFTstate, setNFTstate] = useState<NFTProps[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [IMX, setIMX] = useState(0);
  const [Points, setPoints] = useState(0);
  const [InfoLoading, setInfoLoading] = useState(false);
  const [User, _] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setInfoLoading(true);
      const result = await getInventoryData(User);
      setBalance(parseInt(result.balance));
      setIMX(parseInt(result.balanceInEther));
      try {
        setPoints(result.data.entries[0].data.TotalPoints);
      } catch {
        setPoints(0)
      }
      setInfoLoading(false);
    }

    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAddress = await getAddress(User);
      setAddress(fetchedAddress);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (address) {
        const NftbyAddress: NFTProps[] | undefined = await getNftByAddress(address);
        setNFTstate(NftbyAddress);
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address]);

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold my-4">Inventory</h1>
      {loading || InfoLoading ? <div className="my-7 flex justify-center"><Load className="w-8 h-8" /></div> :
        <div>
          <div className="flex flex-row space-x-4 justify-center mx-2 items-center xb:flex-col">
            <div className='flex flex-row mb-1 mt-3 bg-gray-950 p-2 rounded'>
              <Image
                src="/tIMX.svg"
                alt="tIMX Logo"
                width={28}
                height={28}
                priority
              />
              <div className='font-extrabold text-white ml-1'>
                tIMX
              </div>
              <p className="font-medium pl-6 text-[#b7b7b7]">{IMX}</p>
            </div>
            <div className='flex flex-row mb-1 mt-3 bg-gray-950 p-2 rounded'>
              <Image
                src="/IPX.png"
                alt="IPX Logo"
                width={28}
                height={28}
                priority
              />
              <div className='font-extrabold text-white ml-1'>
                IPX
              </div>
              <p className="font-medium pl-6 text-[#b7b7b7]">{balance}</p>
            </div>
            <div className='flex flex-row mb-1 mt-3 bg-gray-950 p-2 rounded'>
              <Image
                src="/Points3.svg"
                alt="Bullet Img"
                width={28}
                height={28}
                priority
              />
              <div className='font-extrabold text-white ml-1'>
                Points
              </div>
              <p className="font-medium pl-6 text-[#b7b7b7]">{Points}</p>
            </div>
          </div>
          {NFTstate?.length === 0 ? <p className="text-2xl text-gray-700 font-bold mt-10">You dont have any Pixels Invader NFTs. Buy or Mint one.</p> :
            <div className="flex flex-wrap justify-center">
              {NFTstate?.map((nft, index) => (
                <NFTCard key={index} balance={balance} points={Points} nftData={nft} />
              ))}
            </div>
          }
        </div>
      }
    </div>
  );
};

export default Inventory;
