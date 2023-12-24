const fs = require('fs');
const path = require('path');

const generateNFTFile = (id, tokenId, name, description, level) => {
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

const generateNFTFiles = (numFiles) => {
  for (let i = 1; i <= numFiles; i++) {
    generateNFTFile(
      i.toString(),
      i.toString(),
      `Extra Health`,
      `This NFT will give you extra Health.`,
      '1',
      '1'
    );
  }
};

generateNFTFiles(50);
