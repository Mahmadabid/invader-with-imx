import { ethers } from 'hardhat';

async function main() {

  const deploymentOptions = { gasPrice: ethers.parseUnits('10', 'gwei') };

  const Swap = await ethers.deployContract('Swap', ['0xBC1B90037EC05B0931CfC2e35E4e15dB71F2738F'], deploymentOptions);

  await Swap.waitForDeployment();

  console.log('Swap deployed to:', await Swap.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
