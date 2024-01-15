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
      "Pixels Invader Fire Powerups",
      "PXF",
      "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmcAfFLSNRdLiTsy6P3oUQgn8TLd8FkdsJeqdk9WJE6ntz/",
      "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmfBzg6zmvJ4SsFHuZYhukT48ZLYVQapxPcUBgjvLmZvJM/",
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
