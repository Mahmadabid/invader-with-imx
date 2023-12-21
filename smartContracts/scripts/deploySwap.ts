import { ethers } from 'hardhat';

async function main() {

  const deploymentOptions = {
    maxPriorityFeePerGas: 100e9,
    maxFeePerGas: 150e9,
    gasLimit: 200000,
    };

  const Swap = await ethers.deployContract('Swap', ['0xc9729c9fB7eFb4508864141Fa80E0694e3D97658'], deploymentOptions);

  await Swap.waitForDeployment();

  console.log('Swap deployed to:', await Swap.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
