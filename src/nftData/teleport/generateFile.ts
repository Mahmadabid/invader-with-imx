import { ethers } from "ethers";
import path from "path";
import fs from 'fs';
import { PrivateKey } from "../utils";
import { teleportpowerupsABI, teleportpowerupsAddress } from "../../components/Contracts/TeleportPowerupsContract";

const generateNFTFile = (id: string, tokenId: string, name: string, description: string, level: string) => {
  const nftData = {
    id,
    image: `https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmR4fgNC2GFnWn2yadUZfsmeS5ZgRuEcJwCXaEWFiyjPqV/`,
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

  const folderPath = path.join(__dirname, 'teleport_nft_metadata');
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
  
  const contract = new ethers.Contract(teleportpowerupsAddress, teleportpowerupsABI, wallet);
  const totalSupply = await contract.getTotalMint();

  const numFiles = totalSupply.toNumber() + 50;

  for (let i = 1; i <= 50; i++) {
    generateNFTFile(
      i.toString(),
      i.toString(),
      `Teleport`,
      `This NFT allows your ship to teleport to starting position.`,
      '1',
    );
  }
};

generateNFTFiles();
