import { getDefaultProvider, Wallet } from 'ethers';
import { Provider, TransactionResponse } from '@ethersproject/providers';
import { ERC721Client } from '@imtbl/contracts';
import { PrivateKey } from '../utils';
import { newTeleportBaseURI, teleportpowerupsAddress } from '../../components/Contracts/TeleportPowerupsContract';

const CONTRACT_ADDRESS = teleportpowerupsAddress;
const PRIVATE_KEY = PrivateKey;
const provider = getDefaultProvider('https://rpc.testnet.immutable.com');
const NEW_BASE_URI = newTeleportBaseURI;

const updateCollectionBaseURI = async (
  provider: Provider
): Promise<TransactionResponse> => {
  // Bound contract instance
  const contract = new ERC721Client(CONTRACT_ADDRESS);

  // The wallet of the intended signer of the mint request
  const wallet = new Wallet(PRIVATE_KEY, provider);

  // This is the value from your metadata hosting service noted from the previous step
  const baseURI = NEW_BASE_URI;

  // Rather than be executed directly, contract write functions on the SDK client are returned
  // as populated transactions so that users can implement their own transaction signing logic.
  const populatedTransaction = await contract.populateSetBaseURI(baseURI);

  const result: TransactionResponse = await wallet.sendTransaction(
    populatedTransaction
  );
  console.log(result);
  return result;
};

updateCollectionBaseURI(provider);