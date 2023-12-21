import { ethers } from "hardhat";
import {
  MyERC721MintByID,
  MyERC721MintByID__factory,
} from "../typechain-types";

async function deploy() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const operatorAllowlist = process.env.OPERATOR_ALLOWLIST;
  if (operatorAllowlist === undefined) {
    throw new Error("Please set your OPERATOR_ALLOWLIST in a .env file");
  }

  const factory: MyERC721MintByID__factory = await ethers.getContractFactory(
    "MyERC721MintByID"
  );
  const contract: MyERC721MintByID = await factory.connect(deployer).deploy(
    deployer.address,
    "Pixels Ship",
    "PXS",
    "https://example-base-uri.com/", // baseURI
    "https://example-contract-uri.com/", // contractURI
    operatorAllowlist,
    deployer.address,
    ethers.toBigInt("2000")
  );
  await contract.deployed();

  console.log(`MyERC721MintByID contract deployed to ${contract.address}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
