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
      "Pixels Invader Teleport Powerups",
      "PXTe",
      "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmVrSZtZWFA31UxUY4Na3hLniL8ifbfoXoh1rKjpPn5Gtc/",
      "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmTApmyZ5TrUeCMhpHAAr6g6tJWHcCknsNp8A4x63VHb4D/",
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
