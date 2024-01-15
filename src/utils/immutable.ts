import { enemyFirepowerupsAddress } from '@/components/Contracts/EnemyFirePowerupsContract';
import { firepowerupsAddress } from '@/components/Contracts/FirePowerupsContract';
import { healthpowerupsAddress } from '@/components/Contracts/HealthPowerupsContract';
import { shipABI, shipAddress } from '@/components/Contracts/ShipContract';
import { swapABI, swapAddress } from '@/components/Contracts/SwapContract';
import { timerpowerupsAddress } from '@/components/Contracts/TimerPowerupsContract';
import { gameTokenAddress, gameTokenABI } from '@/components/Contracts/TokenContract';
import { ERC721Client } from '@imtbl/contracts';
import { config, blockchainData, passport } from '@imtbl/sdk';
import { Signer, ethers } from "ethers";

export type UserProps = 'metamask' | 'passport' | undefined;

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

const UserProvider = () => {
  const userStorageData = localStorage.getItem('user_provider_pixels_invader');
  const userParsedData = userStorageData?.toString() as UserProps;
  return userParsedData;
}

async function signerFetch(User: UserProps) {

  if (User === 'metamask') {
    const metamaskProvider = new ethers.providers.Web3Provider((window as any).ethereum);
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    const metamaskSigner = metamaskProvider.getSigner();

    const signer = metamaskSigner;
    return signer;

  } else {

    const passportProviders = new ethers.providers.Web3Provider(passportProvider);
    await passportProviders.send("eth_requestAccounts", []);
    const passportSigner = passportProviders.getSigner();

    const signer = passportSigner;
    return signer;
  }
}

const getAddress = async (User: UserProps) => {
  if (User === 'passport') {
    const accounts = await passportProvider.request({ method: "eth_requestAccounts" });
    const walletAddress = accounts[0];
    return walletAddress;
  }
  if (User === 'metamask') {
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts && accounts.length > 0) {
      const walletAddress = accounts[0];
      return walletAddress;
    }
  }
}

async function getNftByAddress(accountAddress: string) {
  try {
    const chainName = 'imtbl-zkevm-testnet';

    const shipContractAddress = shipAddress;

    const shipResponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: shipContractAddress });

    const healthContractAddress = healthpowerupsAddress;

    const healthResponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: healthContractAddress });

    const fireContractAddress = firepowerupsAddress;

    const fireResponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: fireContractAddress });

    const enemyFireContractAddress = enemyFirepowerupsAddress;

    const enemyFireResponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: enemyFireContractAddress });

    const timerContractAddress = timerpowerupsAddress;

    const timerResponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: timerContractAddress });

    return [...shipResponse.result, ...healthResponse.result, ...fireResponse.result, ...timerResponse.result, ...enemyFireResponse.result];
  } catch (error) {
    console.log(error)
  }
}

async function getNftByCollection(User: UserProps) {

  const accountAddress = await getAddress(User);

  try {
    const chainName = 'imtbl-zkevm-testnet';

    const shipContractAddress = shipAddress;

    const response = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: shipContractAddress });

    const responseResult = response.result;

    const contract = new ethers.Contract(shipAddress, shipABI, browserSigner);

    let LevelbyTokenID = ''

    if (responseResult.length !== 0) {
      LevelbyTokenID = await contract.getTokenLevel(responseResult[0].token_id);
    }

    const healthContractAddress = healthpowerupsAddress;

    const healthresponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: healthContractAddress });

    const enemyFireContractAddress = enemyFirepowerupsAddress;

    const enemyFireResponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: enemyFireContractAddress });

    const fireContractAddress = firepowerupsAddress;

    const fireresponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: fireContractAddress });

    const timerContractAddress = timerpowerupsAddress;

    const timerresponse = await client.listNFTsByAccountAddress({ chainName, accountAddress, contractAddress: timerContractAddress });

    const PowerupsResult = [...healthresponse.result, ...fireresponse.result, ...timerresponse.result, ...enemyFireResponse.result]

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

async function getInventoryData(User: UserProps) {
  const signer = await signerFetch(User);

  const walletAddress = await signer.getAddress();

  const IMXBalance = await signer.getBalance();
  const balanceInEther = ethers.utils.formatEther(IMXBalance);

  const tokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);
  const tokenBalance = await tokenContract.balanceOf(walletAddress);

  const balance = ethers.utils.formatEther(tokenBalance);

  let user = '';

  if (User === 'passport') {
    const userId = await passportInstance.getUserInfo();
    user = userId?.sub || ''
  } else if (User === 'metamask') {
    user = await getMetamaskSub()
  }

  const url = `/api/data?userId=${user}`;

  const response = await fetch(url);
  const data = await response.json();

  return { data, balance, balanceInEther }
}

const getProfileInfo = async (User: UserProps) => {

  const signer = await signerFetch(User);
  const walletAddress = await signer.getAddress();

  const balance = await signer.getBalance();
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
}

const ethersContractInstance = async (signer: Signer, CONTRACT_ADDRESS: string) => {

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    [
      'function safeTransferFrom(address from, address to, uint256 tokenId)',
    ],
    signer,
  );
};

const ethersTransfer = async (RECIPIENT: string, TOKEN_ID: string, CONTRACT_ADDRESS: string, setTxn: (value: React.SetStateAction<any>) => void, User: UserProps) => {

  const signer = await signerFetch(User);

  const sender = await signer.getAddress();

  const contract = await ethersContractInstance(signer, CONTRACT_ADDRESS);

  const transaction = await contract.safeTransferFrom(sender, RECIPIENT, TOKEN_ID, {
    maxPriorityFeePerGas: 100e9,
    maxFeePerGas: 150e9,
    gasLimit: 2000000,
  });

  await transaction.wait();

  setTxn(transaction.hash);

  return;
}

const contractInstance = (CONTRACT_ADDRESS: string) => {

  return new ERC721Client(CONTRACT_ADDRESS);
};

const transfer = async (RECIPIENT: string, TOKEN_ID: string, CONTRACT_ADDRESS: string, setTxn: (value: React.SetStateAction<any>) => void, User: UserProps) => {

  const signer = await signerFetch(User);

  const sender = await signer.getAddress();

  const contract = contractInstance(CONTRACT_ADDRESS);

  const populatedTransaction = await contract[
    'populateSafeTransferFrom(address,address,uint256)'
  ](sender, RECIPIENT, TOKEN_ID);

  const transaction = await signer.sendTransaction(populatedTransaction);

  await transaction.wait();

  setTxn(transaction.hash);

  return;
};

const burn = async (TOKEN_ID: string | number, CONTRACT_ADDRESS: string, setTxn: (value: React.SetStateAction<any>) => void, User: UserProps) => {

  const signer = await signerFetch(User);

  const contract = contractInstance(CONTRACT_ADDRESS);

  const populatedTransaction = await contract.populateBurn(TOKEN_ID);

  const transaction = await signer.sendTransaction(populatedTransaction);

  await transaction.wait();

  setTxn(transaction.hash);

  return;
};


async function getLeaderBoard() {
  try {
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

const getMetamaskSub = async () => {
  const address = await getAddress('metamask');
  if (!address) return '';
  const sub = `metamask | ${address}`

  return sub;
}

async function getWalletInfo(User: UserProps) {

  try {
    const signer = await signerFetch(User);
    const walletAddress = await signer.getAddress();

    const balance = await signer.getBalance();
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

export { passportInstance, passportProvider, getInventoryData, getMetamaskSub, UserProvider, configs, getAddress, browserSigner, browserProvider, getNftByCollection, getProfileInfo, getLeaderBoard, getWalletInfo, getNftByAddress, signerFetch, client, burn, transfer };
