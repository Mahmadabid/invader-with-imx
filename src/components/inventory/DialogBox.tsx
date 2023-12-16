import { burn, transfer } from '@/utils/immutable';
import React, { ChangeEvent, useState } from 'react';
import Load from '../utils/Load';
import Link from 'next/link';

type DialogProps = {
    handleClose: () => void;
    tokenId: string | null;
    contractAddress: string | null;
}

const DialogBox: React.FC<DialogProps> = ({ handleClose, tokenId, contractAddress }) => {

    const [option, setOption] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [Txn, setTxn] = useState<any>();
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    return (
        <div className={`fixed flex inset-0 items-center justify-center z-50`}>
            {loading ?
                <div className='z-50'>
                    <div className="fixed inset-0 bg-black opacity-75"></div>
                    <div className="relative bg-white p-8 max-w-md mx-auto rounded shadow-lg">
                        {Txn ? <><h1 className='text-lg font-medium text-gray-900 my-3 truncate'>{Txn.hash}</h1>
                            <Link href={`https://explorer.testnet.immutable.com/tx/${Txn.hash}`} target="_blank"><button className="hover:bg-green-500 text-white px-4 py-2 mt-2 bg-green-600 rounded">Explorer</button></Link>
                            <div className='text-center mt-2'><p className='text-slate-600 font-medium'>Reload Page to view changes</p></div>
                        </> : <>
                            <h1 className='text-xl font-medium text-gray-950 my-3'>Waiting For Transaction</h1>
                            <div className='flex justify-center'><Load className='w-6 h-6' /></div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="px-4 py-1 text-white font-medium text-lg bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
                                    onClick={() => {
                                        handleClose();
                                        setLoading(false);
                                        setOption(0);
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        </>}
                    </div>
                </div> :
                <>
                    <div className="fixed inset-0 bg-black opacity-75"></div>
                    <div className="relative bg-white p-8 max-w-md mx-auto rounded shadow-lg">
                        <h1 className='text-xl font-medium my-2 mb-7'>You can perform following actions.</h1>
                        <button onClick={() => setOption(1)} className='px-2 py-2 font-medium text-white bg-green-500 hover:bg-emerald-500 rounded mx-2'>Transfer</button>
                        <button onClick={() => {
                            setLoading(true);
                            burn(tokenId ? tokenId : '', contractAddress ? contractAddress : '', setTxn)
                        }} className='px-2 py-2 font-medium text-white bg-orange-500 hover:bg-amber-500 rounded mx-2'>Burn</button>
                        {option === 1 ?
                            <div className='mt-6'>
                                <p className='my-2 text-red-500 font-medium'>Please Enter a valid address. To ensure successful Transaction</p>
                                <input type='text' value={inputValue} onChange={handleChange} className='bg-gray-950 text-white p-2 rounded min-w-full' placeholder='Enter Address to transfer this NFT' />
                                <button onClick={() => {
                                    setLoading(true);
                                    transfer(inputValue, tokenId ? tokenId : '', contractAddress ? contractAddress : '', setTxn)
                                }} className='bg-blue-500 hover:bg-teal-500 rounded text-white mt-3 p-2'>Transfer</button>
                            </div>
                            : null
                        }
                        <div className="mt-4 flex justify-end">
                            <button
                                className="px-4 py-1 text-white font-medium text-lg bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
                                onClick={() => {
                                    handleClose();
                                    setOption(0);
                                }}
                            >
                                X
                            </button>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default DialogBox;
