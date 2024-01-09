import { newShipBaseURI, shipAddress } from '../../components/Contracts/ShipContract';
import { blockchainData } from '@imtbl/sdk';
import { client } from '../utils';

const CONTRACT_ADDRESS = shipAddress;
const NEW_BASE_URI = newShipBaseURI;

const refreshCollectionMetadata = async (client: blockchainData.BlockchainData, chainName: string, contractAddress: string) => {
  const collection = await client.getCollection({ chainName: chainName, contractAddress: contractAddress })
  return client.refreshCollectionMetadata({
    chainName,
    contractAddress,
    refreshCollectionMetadataRequest: {
      collection_metadata: {
        base_uri: NEW_BASE_URI,
        name: collection.result.name,
        symbol: collection.result.symbol,
        description: collection.result.description,
        image: collection.result.image,
        contract_uri: collection.result.contract_uri || null,
        external_link: collection.result.external_link,
      }
    }
  })
};

refreshCollectionMetadata(client, "imtbl-zkevm-testnet", CONTRACT_ADDRESS);