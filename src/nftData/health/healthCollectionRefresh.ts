import { healthpowerupsAddress } from '@/components/Contracts/HealthPowerupsContract';
import { config, blockchainData } from '@imtbl/sdk';

const CONTRACT_ADDRESS = healthpowerupsAddress;
const NEW_BASE_URI = '[NEW_BASE_URI]';

const client = new blockchainData.BlockchainData({
  baseConfig: {
    environment: config.Environment.SANDBOX,
    apiKey: 'secret Key',
    publishableKey: 'pk_imapik-test-WBki$1eh0T6ChGo$WVoo',
  },
});

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