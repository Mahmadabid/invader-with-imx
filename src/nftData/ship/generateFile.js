const fs = require('fs');
const path = require('path');

const generateNFTFile = (id, tokenId, name, description, level) => {
  const nftData = {
    id,
    image: `https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmdPYE429FKwFYjqUeYN3jG1ncgwuhb3744VdPBLweEm51/`,
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

const generateNFTFiles = (numFiles) => {
  for (let i = 1; i <= numFiles; i++) {
    generateNFTFile(
      i.toString(),
      i.toString(),
      `Level 1 Ship`,
      `This NFT represents your ship at level 1. Also, it's your profile ship.`,
      '1',
      '1'
    );
  }
};

generateNFTFiles(50);
