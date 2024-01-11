import { firepowerupsAddress } from '@/components/Contracts/FirePowerupsContract';
import { healthpowerupsAddress } from '@/components/Contracts/HealthPowerupsContract';
import { shipABI, shipAddress } from '@/components/Contracts/ShipContract';
import { swapABI, swapAddress } from '@/components/Contracts/SwapContract';
import { timerpowerupsAddress } from '@/components/Contracts/TimerPowerupsContract';
import { gameTokenAddress, gameTokenABI } from '@/components/Contracts/TokenContract';
import { ERC721Client } from '@imtbl/contracts';
import { config, blockchainData, passport } from '@imtbl/sdk';
import { ethers } from "ethers";

const passportInstance = new passport.Passport({
  baseConfig: {
    environment: config.Environment.SANDBOX,
    publishableKey: process.env.NEXT_PUBLIC_PUBLISH_KEY || '',
  },
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_URL + 'auth/callback/',
  logoutRedirectUri: process.env.NEXT_PUBLIC_URL || '',
  audience: 'platform_api',
  scope: 'openid offline_access email transact',
  logoutMode: 'silent',
});

const configs = {
  baseConfig: {
    environment: config.Environment.SANDBOX,
    publishableKey: process.env.NEXT_PUBLIC_PUBLISH_KEY,
  },
};

const client = new blockchainData.BlockchainData(configs);

const passportProvider = passportInstance.connectEvm();

const browserProvider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.immutable.com');

const browserSigner = browserProvider.getSigner();

async function signerFetch() {
  const provider = new ethers.providers.Web3Provider(passportProvider);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  return signer;
}

const getAddress = async () => {
  const accounts = await passportProvider.request({ method: "eth_requestAccounts" });
  const walletAddress = accounts[0];
  return walletAddress;
}

async function getNftByAddress(accountAddress: string) {
  try {
    const chainName = 'imtbl-zkevm-testnet';

    const shipContractAddress = shipAddress;

    const shipResponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: shipContractAddress });

    const healthContractAddress = healthpowerupsAddress;

    const healthResponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: healthContractAddress });

    const fireContractAddress = firepowerupsAddress;

    const fireFesponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: fireContractAddress });

    const timerContractAddress = timerpowerupsAddress;

    const timerResponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: timerContractAddress });

    return [...shipResponse.result, ...healthResponse.result, ...fireFesponse.result, ...timerResponse.result];
  } catch (error) {
    console.log(error)
  }
}

async function getNftByCollection() {

  const accountAddress = await getAddress();

  try {

    const signer = await signerFetch();

    const chainName = 'imtbl-zkevm-testnet';

    const shipContractAddress = shipAddress;

    const response = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: shipContractAddress });

    const responseResult = response.result;

    const contract = new ethers.Contract(shipAddress, shipABI, signer);

    let LevelbyTokenID = ''

    if (responseResult.length !== 0) {
      LevelbyTokenID = await contract.getTokenLevel(responseResult[0].token_id);
    }

    const healthContractAddress = healthpowerupsAddress;

    const healthresponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: healthContractAddress });

    const fireContractAddress = firepowerupsAddress;

    const fireresponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: fireContractAddress });

    const timerContractAddress = timerpowerupsAddress;

    const timerresponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: timerContractAddress });

    const PowerupsResult = [...healthresponse.result, ...fireresponse.result, ...timerresponse.result]

    return {
      responseResult,
      LevelbyTokenID,
      PowerupsResult,
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

async function getInventoryData() {
  const signer = await signerFetch();

  const walletAddress = await signer.getAddress();

  const tokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);
  const tokenBalance = await tokenContract.balanceOf(walletAddress);

  const balance = ethers.utils.formatEther(tokenBalance);

  const userId = await passportInstance.getUserInfo();
  const user = userId?.sub;

  const url = `/api/data?userId=${user}`;

  const response = await fetch(url);
  const data = await response.json();

  return { data, balance }
}

async function getProfileInfo() {
  try {
    // for metamask
    // const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    // await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    // const signer = provider.getSigner();

    // const walletAddress = await signer.getAddress();

    // const balance = await signer?.provider.getBalance(walletAddress ? walletAddress : '');
    // const balanceInEther = ethers.utils.formatEther(balance ? balance : '');

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
    ;

    const tokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, browserSigner);
    const burnLeaderboard = await tokenContract.getBurnedAmounts();

    const swapContract = new ethers.Contract(swapAddress, swapABI, browserSigner);
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

export { passportInstance, passportProvider, getInventoryData, configs, getAddress, browserSigner, browserProvider, fetchAuth, getNftByCollection, getProfileInfo, getLeaderBoard, getWalletInfo, getNftByAddress, signerFetch, client, burn, transfer };
