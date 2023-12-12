import { gameTokenAddress, gameTokenABI } from '@/components/Contracts/TokenContract';
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
    const accounts = await passportProvider.request({
      method: "eth_requestAccounts",
    });
    console.log("connected", accounts);
  } catch (error) {
    console.error(error, 'not found');
  } finally {
    window.location.reload();
  }
};

async function signerFetch() {
  const provider = new ethers.providers.Web3Provider(passportProvider);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  return signer;
}

async function getProfileInfo() {
  try {
    const signer = await signerFetch();
    const walletAddress = await signer.getAddress();

    const balance = await passportProvider.request({
      method: 'eth_getBalance',
      params: [walletAddress, 'latest']
    });

    const balanceInEther = ethers.utils.formatEther(balance);

    const tokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);
    const tokenBalance = await tokenContract.balanceOf(walletAddress);

    const burnBalance = await tokenContract.getBurnedAmount(walletAddress);
    
    return {
      walletAddress,
      balanceInEther,
      tokenBalance: ethers.utils.formatEther(tokenBalance),
      burnBalance: ethers.utils.formatEther(burnBalance)
    };
  } catch (error) {
    console.error("Error getting wallet info:", error);
    return {
      walletAddress: null,
      balanceInEther: null,
      tokenBalance: null
    };
  }
}

async function getWalletInfo() {

  try {
    const signer = await signerFetch();
    const walletAddress = await signer.getAddress();

    const balance = await passportProvider.request({
      method: 'eth_getBalance',
      params: [walletAddress, 'latest']
    });
    const balanceInEther = ethers.utils.formatEther(balance);

    const tokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);
    const tokenBalance = await tokenContract.balanceOf(walletAddress);

    return {
      balanceInEther,
      tokenBalance: ethers.utils.formatEther(tokenBalance),
      signer,
      walletAddress
    };
  } catch (error) {
    console.error("Error getting wallet info:", error);
    return {
      balanceInEther: null,
      tokenBalance: null,
    };
  }
}

export { passportInstance, passportProvider, fetchAuth, getProfileInfo, getWalletInfo, signerFetch };
