import { shipAddress, shipABI } from "../../components/Contracts/ShipContract";
import { ethers } from "ethers";
import path from "path";
import fs from 'fs';
import { PrivateKey } from "../utils";

const generateNFTFile = (id: string, tokenId: string, name: string, description: string, level: string) => {

  let imageURL;

  if (level === '3') {
    imageURL = 'https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmZK7p8KTitDc1vxz23Xd83Ddo7jxrnebsjf8FKhc3AQh6/';
  } else if (level === '4') {
    imageURL = 'https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmTqceHT2tadsC89vFimny7Y5Di8DnQ2mdASodYzMsytCR/';
  } else if (level === '2') {
    imageURL = 'https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmRn5a6ZGXbJMhLKFomKGFBLZ8zrMyMBvgrU39tzrsUGpu/';
  }
  else {
    imageURL = 'https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmdvvQk1ywhsv6pRfMQLq27jVD2v7pvJqomMes4hU1xEx9/';
  }

  const nftData = {
    id,
    image: imageURL,
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

  const folderPath = path.join(__dirname, 'ship_nft_metadata');
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

  const contract = new ethers.Contract(shipAddress, shipABI, wallet);

  const IDLevels = await contract.getAllTokenLevelsAndIds();

  for (let i = 0; i < IDLevels[0].length; i++) {
    const level = IDLevels[1][i].toString();
    
    generateNFTFile(
      IDLevels[0][i].toString(),
      IDLevels[0][i].toString(),
      `Level ${level} Ship`,
      `This NFT represents your ship at level ${level}. Also, it's your profile ship.`,
      level,
    );
  }

  for (let i = 0; i < 50; i++) {
    const newFileId = (IDLevels[0].length + i + 1).toString();
    const level = '1';
    generateNFTFile(
      newFileId,
      newFileId,
      `Level ${level} Ship`,
      `This NFT represents your ship at level ${level}. Also, it's your profile ship.`,
      level,
    );
  }
};

generateNFTFiles();
