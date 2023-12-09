import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Load from '@/components/utils/Load';

const Swap = () => {
  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [sellAmount, setSellAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const feePercentage: number = 1;
  const [mint, setMint] = useState(false);
  const [Hash, setHash] = useState('');
  const [TxnError, setTxnError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleBuyAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBuyAmount(parseFloat(e.target.value));
  };

  const handleSellAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSellAmount(parseFloat(e.target.value));
  };

  const handleBuySubmit = () => {
    // Implement your buy submit logic here
  };

  const handleSellSubmit = () => {
    // Implement your sell submit logic here
  };

  const headerHeight = 4.6;

  return (
    <div className="bg-gray-950 flex flex-col items-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
      <h1 className='text-white text-6xl my-8 font-extrabold'>$IPX Swap</h1>
      {mint ? (
        <>
          <div className='flex rounded flex-col break-all items-center justify-center'>
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
                  ) : (
                    <div className="flex flex-col font-bold items-center mb-2">
                      <h3 className="text-xl text-gray-600 mb-2">Waiting for Transaction</h3>
                      <Load className='w-7 h-7 mt-6 fill-gray-800' />
                    </div>
                  )
                ) : (
                  <>
                    <div className="flex flex-col font-bold items-center mb-2">
                      <p className="text-xl text-gray-600 mb-2">Purchase Was Successful</p>
                      <p className="border-b border-gray-300 pb-2 mr-2 flex-grow">
                        <span className="font-bold flex flex-row items-center">Hash:&nbsp;{Hash}</span>
                      </p>
                    </div>
                    {success ? (
                      <div className="flex flex-col text-center justify-center mt-2">
                        <p className="text-green-700 text-xl font-bold my-2">Success</p>
                        <Link href="/">
                          <button className="bg-yellow-500 text-white font-bold px-4 py-2 rounded mt-2">
                            View in main page
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex text-xl font-bold text-green-800 justify-center mt-2">
                        Finalizing
                        <svg className="animate-spin w-7 h-7 mr-3 fill-gray-800" viewBox="3 3 18 18">
                          <path className="opacity-20" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                          </path>
                          <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                          </path>
                        </svg>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex xse:w-64 w-96">
            <button
              className={`font-bold py-2 xse:w-32 w-48 px-4 rounded ${activeTab === 'buy' ? 'bg-green-500 text-white' : 'bg-green-900 text-white'
                }`}
              onClick={() => setActiveTab('buy')}
            >
              Buy
            </button>
            <button
              className={`font-bold py-2 xse:w-32 w-48 px-4 rounded ${activeTab === 'sell' ? 'bg-red-500 text-white' : 'bg-red-900 text-white'
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
              className={`bg-yellow-500 text-white font-bold w-full rounded py-2 px-4 mt-4 ${(activeTab === 'buy' ? buyAmount <= 0 || isNaN(buyAmount) : sellAmount <= 0 || isNaN(sellAmount)) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={(activeTab === 'buy' ? buyAmount <= 0 || isNaN(buyAmount) : sellAmount <= 0 || isNaN(sellAmount))}
            >
              {activeTab === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Swap;
