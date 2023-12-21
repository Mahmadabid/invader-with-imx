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
    gasLimit: 10000000,
    }
    
  const factory = await ethers.deployContract(
    "ImmutableERC721MintByID",[deployer.address,
      "Pixels Invader Ships",
      "PXS",
      "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmQHFTWSQfb34cUG58Cqcsw7L56cTPikvUVz3XXxSdwXdT/?_gl=1*3e42d3*_ga*Nzg4ODE3OTk3LjE2OTYyNzkyMTA.*_ga_5RMPXG14TE*MTcwMzE4Mzg3Ny4xMi4xLjE3MDMxODY1NzAuMjUuMC4w/",
      "https://blush-accepted-turkey-504.mypinata.cloud/ipfs/QmQ63zTYSj16rcGmMbat2gd38xsNpo2FPJ12ZM6YGwQV58?_gl=1*1sh190p*_ga*Nzg4ODE3OTk3LjE2OTYyNzkyMTA.*_ga_5RMPXG14TE*MTcwMzE4Mzg3Ny4xMi4xLjE3MDMxODU1MDIuMzUuMC4w/",
      operatorAllowlist,
      deployer.address,
      ethers.parseUnits("2000")] , deploymentOptions
  );

  await factory.waitForDeployment();

  console.log(`ImmutableERC721MintByID contract deployed to ${factory.getAddress()}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
