import { ethers } from 'hardhat';

async function main() {

  const deploymentOptions = { gasPrice: ethers.parseUnits('10', 'gwei') };

  const Swap = await ethers.deployContract('Swap', ['0xEAEdae741E7F591476ddb0fDF21dD6Dcfa492891'], deploymentOptions);

  await Swap.waitForDeployment();

  console.log('Swap deployed to:', await Swap.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
