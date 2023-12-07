import { ethers } from 'hardhat';

async function main() {
  // Deploy GameToken
  const GameToken = await ethers.deployContract('GameToken');

  await GameToken.waitForDeployment();
  console.log('GameToken deployed to:', GameToken.getAddress());

  // Deploy Market
  const Market = await ethers.getContractFactory('Market');
  const market = await Market.deploy(GameToken.getAddress());

  await market.waitForDeployment();
  console.log('Market deployed to:', market.getAddress());
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
