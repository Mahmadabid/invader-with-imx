const fs = require('fs');
const path = require('path');

const generateNFTFile = (id, tokenId, name, description, level, ammo) => {
  const nftData = {
    id,
    image: `https://bafkreiemy3ttpbt3unwtzsqhsceu5hma22jvxu7lk6il7faotyw4xvmhb4.ipfs.nftstorage.link/`,
    token_id: tokenId,
    name,
    description,
    attributes: [
      {
        trait_type: 'Level',
        value: level,
      },
      {
        trait_type: 'Ammo',
        value: ammo,
      },
    ],
  };

  const folderPath = path.join(__dirname, 'nft_metadata');
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
      'Basic',
      '1'
    );
  }
};

generateNFTFiles(30);
