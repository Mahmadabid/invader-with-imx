import { blockchainData, config } from "@imtbl/sdk";

export const PrivateKey = '';

const ApiKey = '';

export const client = new blockchainData.BlockchainData({
  baseConfig: {
    environment: config.Environment.SANDBOX,
    apiKey: ApiKey,
    publishableKey: 'pk_imapik-test-WBki$1eh0T6ChGo$WVoo',
  },
});