import { ethers } from 'hardhat';

async function main() {

    const deploymentOptions = { gasPrice: ethers.parseUnits('10', 'gwei') };

    const BurnContract = await ethers.deployContract('BurnContract', ['0x1c99e067B7DF2eac2385692445B14d7F24c0ecF3'], deploymentOptions);

    await BurnContract.waitForDeployment();

    console.log('BurnContract deployed to:', await BurnContract.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
