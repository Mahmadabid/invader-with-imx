import { config, passport } from '@imtbl/sdk';
import { ethers } from "ethers";

const passportConfig = {
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX,
  }),
  scope: "transact openid offline_access email",
  audience: "platform_api",
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_URL + 'auth/callback/',
  logoutRedirectUri: process.env.NEXT_PUBLIC_URL || '',
};

const passportInstance = new passport.Passport(passportConfig);

const passportProvider = passportInstance.connectEvm();

const fetchAuth = async () => {
  try {
    const passportProvider = passportInstance.connectEvm();
    const accounts = await passportProvider.request({
      method: "eth_requestAccounts",
    });
    console.log("connected", accounts);
  } catch (error) {
    console.error(error, 'asdasd');
  } finally {
    window.location.reload();
  }
};

async function getWalletInfo() {
  try {
    const accounts = await passportProvider.request({ method: "eth_requestAccounts" });
    const walletAddress = accounts[0];

    const balance = await passportProvider.request({
      method: 'eth_getBalance',
      params: [walletAddress, 'latest']
    });
    const balanceInEther = ethers.utils.formatEther(balance);

    return {
      walletAddress,
      balanceInEther,
    };
  } catch (error) {
    console.error("Error getting wallet info:", error);
    return {
      walletAddress: null,
      balanceInEther: null,
    };
  }
}

export { passportInstance, passportProvider, fetchAuth, getWalletInfo };
