import { ethers } from "hardhat";

async function deploy() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const operatorAllowlist = process.env.OPERATOR_ALLOWLIST;
  if (operatorAllowlist === undefined) {
    throw new Error("Please set your OPERATOR_ALLOWLIST in a .env file");
  }

  const deploymentOptions = {
    maxPriorityFeePerGas: 100e9,
    maxFeePerGas: 150e9,
    gasLimit: 8000000,
    }
    
  const factory = await ethers.deployContract(
    "PowerupsMint",[deployer.address,
      "Pixels Invader Timer Powerups",
      "PXF",
      "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmS7xuucHMgTroQGCC8MqYXU2q9QDeNfe8xPuvSYf1a8fQ/",
      "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmPVUzE6E8SRwMe3otPe2KqjPm7CyokoGbgYA1sgoWPzrf/",
      operatorAllowlist,
      deployer.address,
      ethers.toBigInt("2000"),
    '0xc9729c9fB7eFb4508864141Fa80E0694e3D97658'] , deploymentOptions
  );

  await factory.waitForDeployment();

  console.log(`PowerupsMint contract deployed to ${await factory.getAddress()}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
