import { getDefaultProvider } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ERC721Client } from "@imtbl/contracts";
import { shipAddress } from "../../components/Contracts/ShipContract";

const CONTRACT_ADDRESS = shipAddress;

const provider = getDefaultProvider("https://rpc.testnet.immutable.com");

const fetch = async (provider: Provider) => {
  const contract = new ERC721Client(CONTRACT_ADDRESS);
  console.log('Contract instance created with address:', CONTRACT_ADDRESS);
  
  const BaseURI = await contract.baseURI(provider)

  console.log("baseURI:", BaseURI);
};

fetch(provider);