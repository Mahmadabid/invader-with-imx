import { swapABI, swapAddress } from '@/components/Contracts/SwapContract';
import { gameTokenAddress, gameTokenABI } from '@/components/Contracts/TokenContract';
import { config, blockchainData, passport } from '@imtbl/sdk';
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

const configs = {
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX,
  }),
};

const client = new blockchainData.BlockchainData(configs);

async function getNftByAddress(accountAddress: string) {
  try {
    const response = await client.listNFTsByAccountAddress({
      chainName: "imtbl-zkevm-testnet",
      accountAddress,
    });

    return response.result;
  } catch (error) {
    console.log(error)
  }
}

const passportInstance = new passport.Passport(passportConfig);

const passportProvider = passportInstance.connectEvm();

const getAddress = async () => {
  const accounts = await passportProvider.request({ method: "eth_requestAccounts" });
  const walletAddress = accounts[0];
  return walletAddress;
}

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

async function getLeaderBoard() {
  try {
    const signer = await signerFetch();

    const tokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);
    const burnLeaderboard = await tokenContract.getBurnedAmounts();
    
    const swapContract = new ethers.Contract(swapAddress, swapABI, signer);
    const BuyBalance = await swapContract.getAllBuyers();
    
    return {
      burnLeaderboard,
      BuyBalance
    };
  } catch (error) {
    console.error("Error getting wallet info:", error);
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

export { passportInstance, passportProvider, getAddress, fetchAuth, getProfileInfo, getLeaderBoard, getWalletInfo, getNftByAddress, signerFetch, client };
