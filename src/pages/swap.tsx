import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Load from '@/components/utils/Load';
import Burn from '@/components/Burn';

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

  const handleBuySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSellSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const headerHeight = 4.6;

  return (
    <div className="bg-gray-950 flex flex-col items-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
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
                        <Load className='w-7 h-7 mr-3 fill-gray-800' />
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
              className={`bg-yellow-500 text-white font-bold w-full rounded py-2 px-4 mt-4 ${(activeTab === 'buy' ? buyAmount <= 0 || isNaN(buyAmount) : sellAmount <= 0 || isNaN(sellAmount)) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={(activeTab === 'buy' ? buyAmount <= 0 || isNaN(buyAmount) : sellAmount <= 0 || isNaN(sellAmount))}
            >
              {activeTab === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </form>
          <Burn setMint={setMint} />
        </>
      )}
    </div>
  );
};

export default Swap;
