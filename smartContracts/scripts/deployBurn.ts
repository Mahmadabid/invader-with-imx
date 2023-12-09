import { ethers } from 'hardhat';

async function main() {

    const deploymentOptions = { gasPrice: ethers.parseUnits('10', 'gwei') };

    const BurnContract = await ethers.deployContract('BurnContract', ['0x3f92e80433424fc84b21B6158ef69d46E0f8b884'], deploymentOptions);

    await BurnContract.waitForDeployment();

    console.log('BurnContract deployed to:', await BurnContract.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
