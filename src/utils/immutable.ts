import { swapABI, swapAddress } from '@/components/Contracts/SwapContract';
import { gameTokenAddress, gameTokenABI } from '@/components/Contracts/TokenContract';
import { ERC721Client } from '@imtbl/contracts';
import { config, blockchainData, passport } from '@imtbl/sdk';
import { Signer, ethers } from "ethers";

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

const passportInstance = new passport.Passport(passportConfig);

const passportProvider = passportInstance.connectEvm();

const getAddress = async () => {
  const accounts = await passportProvider.request({ method: "eth_requestAccounts" });
  const walletAddress = accounts[0];
  return walletAddress;
}

async function getNftByAddress(accountAddress: string) {
  try {
    const chainName = 'imtbl-zkevm-testnet';
    const response = await client.listNFTsByAccountAddress({ chainName, accountAddress });

    return response.result;
  } catch (error) {
    console.log(error)
  }
}

async function getNftByCollection(contractAddress: string) {
  
  const accountAddress = await getAddress();

  try {

    const chainName = 'imtbl-zkevm-testnet';

    const response = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress });
    const responseResult = response.result;

    return {
      responseResult,
      accountAddress
    };

  } catch (error) {
    console.log(error)
  }
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

const contractInstance = (CONTRACT_ADDRESS: string) => {

  return new ERC721Client(CONTRACT_ADDRESS);
};

const transfer = async (RECIPIENT: string, TOKEN_ID: string, CONTRACT_ADDRESS: string, setTxn: (value: React.SetStateAction<any>) => void) => {

  const signer = await signerFetch();

  const sender = await signer.getAddress();

  const contract = contractInstance(CONTRACT_ADDRESS);

  const deploymentOptions = { gasPrice: ethers.utils.parseUnits('10', 'gwei') };

  const populatedTransaction = await contract[
    'populateSafeTransferFrom(address,address,uint256)'
  ](sender, RECIPIENT, TOKEN_ID, deploymentOptions);

  const transaction = await signer.sendTransaction(populatedTransaction);

  setTxn(transaction)

  return transaction
};


const burn = async (TOKEN_ID: string | number, CONTRACT_ADDRESS: string, setTxn: (value: React.SetStateAction<any>) => void) => {

  const signer = await signerFetch();

  const contract = contractInstance(CONTRACT_ADDRESS);

  const deploymentOptions = { gasPrice: ethers.utils.parseUnits('10', 'gwei') };

  const populatedTransaction = await contract.populateBurn(TOKEN_ID, deploymentOptions);

  const transaction = await signer.sendTransaction(populatedTransaction);

  setTxn(transaction)

  return transaction
};


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

export { passportInstance, passportProvider, getAddress, fetchAuth, getNftByCollection, getProfileInfo, getLeaderBoard, getWalletInfo, getNftByAddress, signerFetch, client, burn, transfer };
