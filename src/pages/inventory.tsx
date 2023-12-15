import { getAddress, getNftByAddress } from "@/utils/immutable";
import { useEffect, useState } from "react";

interface NFTProps {
  "result": {
    "chain": {
      "id": "eip155:13473",
      "name": "imtbl-zkevm-testnet"
    },
    "token_id": "1",
    "contract_address": "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    "indexed_at": "2022-08-16T17:43:26.991388Z",
    "metadata_synced_at": "2022-08-16T17:43:26.991388Z",
    "name": "Sword",
    "description": "2022-08-16T17:43:26.991388Z",
    "image": "https://some-url",
    "external_link": "https://some-url",
    "animation_url": "https://some-url",
    "youtube_url": "https://some-url",
    "mint_activity_id": "8d644608-a26f-4e41-bdc8-205cae20c7c5",
    "attributes": [
      {
        "trait_type": "Aqua Power",
        "value": "Happy"
      }
    ]
  }
}

const Inventory = () => {
  const [address, setAddress] = useState("");
  const [NFTstate, setNFTstate] = useState<NFTProps[] | undefined>([]);

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
        try {
          await fetch(`https://api.sandbox.immutable.com/v1/chains/imtbl-zkevm-testnet/accounts/${address}/nfts`)
            .then((response) => response.json())
            .then((data) => {
              setNFTstate(data.result);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchNFTs();
  }, [address]);

  return (
    <div>
      <h1>Inventory</h1>

    </div>
  );
};

export default Inventory;
