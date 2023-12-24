const fs = require('fs');
const path = require('path');

const generateNFTFile = (id, tokenId, name, description, level) => {
  const nftData = {
    id,
    image: `https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmdQ1ppm745225RPJ1y51d33PtWUDAiHr4mefLSDt2Q57r/`,
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

  const folderPath = path.join(__dirname, 'firing_nft_metadata');
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
      `Faster Firing`,
      `This NFT make your ship fire faster.`,
      '1',
      '1'
    );
  }
};

generateNFTFiles(50);
