import { ethers } from "ethers";
import path from "path";
import fs from 'fs';
import { PrivateKey } from "../utils";
import { healthpowerupsAddress, healthpowerupsABI } from "../../components/Contracts/HealthPowerupsContract";

const generateNFTFile = (id: string, tokenId: string, name: string, description: string, level: string) => {
  const nftData = {
    id,
    image: `https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmU62XezuEeVXQkq5DQXZX3od3E61hpkvJ7b9Pfp835ph6/`,
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

  const folderPath = path.join(__dirname, 'health_nft_metadata');
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

  const contract = new ethers.Contract(healthpowerupsAddress, healthpowerupsABI, wallet);
  const totalSupply = await contract.getTotalMint();

  const numFiles = totalSupply.toNumber() + 50;

  for (let i = 1; i <= numFiles; i++) {
    generateNFTFile(
      i.toString(),
      i.toString(),
      `Extra Health`,
      `This NFT will give you extra Health.`,
      '1',
    );
  }
};

generateNFTFiles();
