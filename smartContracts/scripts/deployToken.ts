import { ethers } from 'hardhat';

async function main() {

  const deploymentOptions = { gasPrice: ethers.parseUnits('10', 'gwei') };

  const GameToken = await ethers.deployContract('GameToken', deploymentOptions);

  await GameToken.waitForDeployment();

  console.log('GameToken deployed to:', await GameToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
