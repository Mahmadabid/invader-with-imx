import { ethers } from "hardhat";

async function deploy() {

  const shipBaseURI = 'https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmVGaQRAJTVHnAUGidpUWc2aHyT4TZveYs4mvUK1p7sXe7/';

  const shipContractURI = 'https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmQK9yBb8EFPd1Rf4u9TANbpVPLtRtrJb6LAVHrp9JMgPY/';

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const operatorAllowlist = process.env.OPERATOR_ALLOWLIST;
  if (operatorAllowlist === undefined) {
    throw new Error("Please set your OPERATOR_ALLOWLIST in a .env file");
  }

  const deploymentOptions = {
    maxPriorityFeePerGas: 100e9,
    maxFeePerGas: 150e9,
    gasLimit: 10000000,
  }

  const factory = await ethers.deployContract(
    "ShipsMint", [deployer.address,
    "Pixels Invader Ships",
    "PXS",
    shipBaseURI,
    shipContractURI,
    operatorAllowlist,
    deployer.address,
    ethers.toBigInt("2000")], deploymentOptions
  );

  await factory.waitForDeployment();

  console.log(`ShipsMint contract deployed to ${await factory.getAddress()}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
