import { useState, ChangeEvent, useEffect } from 'react';
import { ethers } from "ethers";
import Link from 'next/link';
import Image from 'next/image';
import Load from '@/components/utils/Load';
import Burn from '@/components/Burn';
import { getWalletInfo } from "@/utils/immutable";
import { swapABI, swapAddress } from '@/components/Contracts/SwapContract';
import { gameTokenABI, gameTokenAddress } from '@/components/Contracts/TokenContract';

const Swap = () => {
  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [sellAmount, setSellAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const feePercentage: number = 1;
  const [Txn, setTxn] = useState(false);
  const [Hash, setHash] = useState('');
  const [Approve, setApprove] = useState(false);
  const [TxnError, setTxnError] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [walletIPX, setWalletIPX] = useState('');
  const [loading, setLoading] = useState(true);
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);

  const fetchWalletInfo = async () => {
    try {
      const info = await getWalletInfo();
      setWalletBalance(info.balanceInEther || '');
      setWalletIPX(info.tokenBalance || '');
      setSigner(info.signer);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const handleBuySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTxn(true);

    if (!signer) {
      console.error('Signer not available');
      return;
    }

    try {
      const buyToken = ethers.utils.parseEther(buyAmount.toString())
      const gasLimit = ethers.utils.parseUnits('10', 'gwei');

      const transaction = await signer.sendTransaction({
        to: swapAddress,
        value: buyToken,
        gasLimit: gasLimit,
      })
      const receipt = await transaction.wait();

      setHash(receipt.transactionHash)

      console.log('Buy successful!');
    } catch (error: any) {
      setTxnError(error.message)
    }
  };

  const handleSellSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTxn(true);

    if (!signer) {
      console.error('Signer not available');
      return;
    }

    try {
      const contract = new ethers.Contract(swapAddress, swapABI, signer);
      const gameToken = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);

      const sellToken = ethers.utils.parseEther(sellAmount.toString())
      const gasLimit = ethers.utils.parseUnits('10', 'gwei');

      setApprove(true);
      const approveTx = await gameToken.approve(swapAddress, sellToken);
      await approveTx.wait();
      setApprove(false);

      const transaction = await contract.sellTokens(sellToken, {
        gasLimit: gasLimit,
      });
      const receipt = await transaction.wait();

      setHash(await receipt.transactionHash)

      console.log('Sell successful!');
    } catch (error: any) {
      setTxnError(error.message)
    }
  };

  const handleBuyAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBuyAmount(parseFloat(e.target.value));
  };

  const handleSellAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSellAmount(parseFloat(e.target.value));
  };

  const headerHeight = 4.6;

  return (
    <div className="bg-gray-950 flex flex-col items-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
      {Txn ? (
        <>
          <div className='flex rounded mt-20 flex-col break-all items-center justify-center'>
            <div
              className="opacity-70 bg-gray-300 p-5 max-w-2xl"
            >
              <div>
                {Hash?.length === 0 ? (
                  TxnError ? (
                    <div className="flex flex-col font-bold items-center justify-center">
                      <p className="text-xl text-red-600">{TxnError}</p>
                      <p className="mt-4 text-blue-800 text-xl">Please Try Again</p>
                    </div>
                  ) : !Approve ? (
                    <div className="flex flex-col font-bold items-center mb-2">
                      <h3 className="text-xl text-gray-600 mb-2">Waiting for Transaction</h3>
                      <Load className='w-7 h-7 mt-6 fill-gray-800' />
                    </div>
                  ) : (
                    <div className="flex flex-col font-bold items-center mb-2 px-10">
                      <h3 className="text-xl text-gray-600 mb-2">Approving</h3>
                      <Load className='w-7 h-7 mt-6 fill-gray-800' />
                    </div>)
                ) : (
                  <>
                    <div className="flex flex-col font-bold items-center mb-2">
                      <p className="text-xl text-gray-600 mb-2">Purchase Was Successful</p>
                      <p className="border-b border-gray-300 pb-2 mr-2 flex-grow">
                        <span className="font-bold flex flex-row items-center">Hash:&nbsp;{Hash}</span>
                      </p>
                    </div>
                    <div className="flex flex-col text-center justify-center mt-2">
                      <p className="text-green-700 text-xl font-bold my-2">Success</p>
                      <Link href="/profile">
                        <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold px-4 py-2 rounded mt-2">
                          View in Profile page
                        </button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className='text-white text-6xl my-8 font-extrabold'>$IPX Swap</h1>
          <div className="flex xse:w-64 w-96">
            <button
              className={`font-bold py-2 xse:w-32 w-48 px-4 rounded ${activeTab === 'buy' ? 'bg-green-500 text-white' : 'bg-green-950 text-white'
                }`}
              onClick={() => setActiveTab('buy')}
            >
              Buy
            </button>
            <button
              className={`font-bold py-2 xse:w-32 w-48 px-4 rounded ${activeTab === 'sell' ? 'bg-red-500 text-white' : 'bg-red-950 text-white'
                }`}
              onClick={() => setActiveTab('sell')}
            >
              Sell
            </button>
          </div>
          <form
            onSubmit={activeTab === 'buy' ? handleBuySubmit : handleSellSubmit}
            className="xse:w-64 w-96 rounded bg-[#2f4f4f] p-4 relative"
          >
            {activeTab === 'buy' ? (
              <div>
                <div className='flex flex-row mb-1 mt-3'>
                  <Image
                    src="/tIMX.svg"
                    alt="tIMX Logo"
                    width={22}
                    height={22}
                    priority
                  />
                  <div className='font-extrabold text-white ml-1'>
                    tIMX
                  </div>
                </div>
                <div className="mb-2">
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={handleBuyAmountChange}
                    className="border p-2 rounded font-medium w-full"
                    required
                  />
                </div>
                <div className='flex flex-row mb-1 mt-3'>
                  <Image
                    src="/IPX.png"
                    alt="IPX Logo"
                    width={28}
                    height={28}
                    priority
                  />
                  <div className='font-extrabold text-white ml-1'>
                    IPX
                  </div>
                </div>
                <div className='bg-white rounded p-2 font-medium'>
                  {buyAmount ? buyAmount * 99 : 0}
                </div>
              </div>
            ) : (
              <div>
                <div className='flex flex-row mb-1 mt-3'>
                  <Image
                    src="/IPX.png"
                    alt="IPX Logo"
                    width={28}
                    height={28}
                    priority
                  />
                  <div className='font-extrabold text-white ml-1'>
                    IPX
                  </div>
                </div>
                <div className="mb-2">
                  <input
                    type="number"
                    value={sellAmount}
                    onChange={handleSellAmountChange}
                    className="border p-2 rounded font-medium w-full"
                    required
                  />
                </div>
                <div className='flex flex-row mb-1 mt-3'>
                  <Image
                    src="/tIMX.svg"
                    alt="tIMX Logo"
                    width={22}
                    height={22}
                    priority
                  />
                  <div className='font-extrabold text-white ml-1'>
                    tIMX
                  </div>
                </div>
                <div className='bg-white rounded p-2 font-medium'>
                  {sellAmount ? (sellAmount / 100) * (99 / 100) : 0}
                </div>
              </div>
            )}

            <div className='flex flex-row mt-4 justify-between text-white'>
              <div className="text-sm">
                {activeTab === 'buy' ? '1 tIMX = 100 IPX' : '1 IPX = 0.0 tIMX'}
              </div>
              <div className="text-sm">
                <span className='font-medium'>Fee: </span> {feePercentage}%
              </div>
            </div>
            <button
              type='submit'
              className={`bg-yellow-500 text-white font-bold w-full rounded py-2 px-4 mt-4 ${loading ? 'justify-center flex' : (activeTab === 'buy' ? buyAmount <= 0 || isNaN(buyAmount) : sellAmount <= 0 || isNaN(sellAmount)) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={(activeTab === 'buy' ? buyAmount <= 0 || isNaN(buyAmount) : sellAmount <= 0 || isNaN(sellAmount)) || loading}
            >
              {loading ? <Load /> : activeTab === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </form>
          <Burn walletIPX={walletIPX} walletBalance={walletBalance} setTxn={setTxn} setHash={setHash} setTxnError={setTxnError} loading={loading} />
        </>
      )}
    </div>
  );
};

export default Swap;
