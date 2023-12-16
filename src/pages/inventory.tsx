import NFTCard, { NFTProps } from "@/components/inventory/NFTCard";
import Load from "@/components/utils/Load";
import { getAddress, getNftByAddress } from "@/utils/immutable";
import { useEffect, useState } from "react";

const Inventory = () => {
  const [address, setAddress] = useState("");
  const [NFTstate, setNFTstate] = useState<NFTProps[] | undefined>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAddress = await getAddress();
      setAddress(fetchedAddress);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (address) {
        const NftbyAddress: any = await getNftByAddress(address);
        setNFTstate(NftbyAddress);
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address]);

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold my-4">Inventory</h1>
      {loading? <div className="my-7 flex justify-center"><Load className="w-8 h-8"/></div>:
      <div className="flex flex-wrap justify-center">
        {NFTstate?.map((nft, index) => (
          <NFTCard key={index} nftData={nft} />
        ))}
      </div>
}
    </div>
  );
};

export default Inventory;
