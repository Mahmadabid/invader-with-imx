import { ethers } from "ethers";
import path from "path";
import fs from 'fs';
import { PrivateKey } from "../utils";
import { enemyFirepowerupsABI, enemyFirepowerupsAddress } from "../../components/Contracts/EnemyFirePowerupsContract";

const generateNFTFile = (id: string, tokenId: string, name: string, description: string, level: string) => {
  const nftData = {
    id,
    image: `https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmXvyhiimq3ryctmJR7kh8FDXsmmzSJqK7L3XNK6XYSu1E/`,
    token_id: tokenId,
    name,
    description,
    attributes: [
      {
        trait_type: 'Level',
        value: level,
      }
    ],
  };

  const folderPath = path.join(__dirname, 'enemy_firing_nft_metadata');
  const fileName = path.join(folderPath, `${id}`);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  fs.writeFileSync(fileName, JSON.stringify(nftData, null, 2));
};

const generateNFTFiles = async () => {

  const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.immutable.com');
  const privateKey = PrivateKey;

  const wallet = new ethers.Wallet(privateKey, provider);
  
  const contract = new ethers.Contract(enemyFirepowerupsAddress, enemyFirepowerupsABI, wallet);
  const totalSupply = await contract.getTotalMint();

  const numFiles = totalSupply.toNumber() + 50;

  for (let i = 1; i <= numFiles; i++) {
    generateNFTFile(
      i.toString(),
      i.toString(),
      `Slower Enemy Firing`,
      `This NFT make your Enemy fire slower.`,
      '1',
    );
  }
};

generateNFTFiles();
