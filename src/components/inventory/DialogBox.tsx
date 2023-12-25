import { burn, getInventoryData, transfer } from '@/utils/immutable';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Load from '../utils/Load';
import Link from 'next/link';
import { shipAddress } from '../Contracts/ShipContract';

type DialogProps = {
    handleClose: () => void;
    tokenId: string | null;
    contractAddress: string | null;
    balance: number;
    points: number;
}

const DialogBox: React.FC<DialogProps> = ({ handleClose, tokenId, contractAddress, balance, points }) => {

    const [option, setOption] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [Txn, setTxn] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [shipLoading, setShipLoading] = useState(false);
    const [shipUpgrade, setShipUpgrade] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const dataToSend = {
        id: tokenId,
        level: '2',
    };

    const sendData = async () => {
        try {
            setShipLoading(true);
            if (points >= 200 && balance >= 50) {
                const response = await fetch('/api/upgrade', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend)
                });

                if (response.ok) {
                    console.log('Upgraded successfully', response);
                } else {
                    console.error('Failed to Upgrade. Status:', response.status);
                    throw new Error('Failed to Upgrade');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setShipLoading(false);
            setShipUpgrade(true);
        }
    };

    return (
        <div className={`fixed flex inset-0 items-center justify-center z-50`}>
            {loading ?
                <div className='z-50'>
                    <div className="fixed inset-0 bg-black opacity-75"></div>
                    <div className="relative bg-white p-8 max-w-md mx-auto rounded shadow-lg">
                        {Txn ? <><h1 className='text-lg font-medium text-gray-900 my-3 truncate'>{Txn.hash}</h1>
                            <Link href={`https://explorer.testnet.immutable.com/tx/${Txn.hash}`} target="_blank"><button className="hover:bg-green-500 text-white px-4 py-2 mt-2 bg-green-600 rounded">Explorer</button></Link>
                            <div className='text-center mt-2'><p className='text-slate-600 font-medium'>Reload Page to view changes</p></div>
                        </> : <div className='text-center'>
                            <h1 className='text-xl font-medium text-gray-950 my-3'>Waiting For Transaction</h1>
                            <div className='flex justify-center'><Load className='w-6 h-6 my-2' /></div>                            <div className="mt-4 flex justify-end">
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
                        </div>}
                    </div>
                </div> :
                <>
                    <div className="fixed inset-0 bg-black opacity-75"></div>
                    {shipLoading ?
                        <div className="relative bg-white flex flex-col justify-center text-center p-8 max-w-md mx-auto rounded shadow-lg">
                            <h1 className='text-2xl font-bold text-slate-600'>Upgrading</h1>
                            <div className='flex justify-center'><Load className='w-8 h-8 fill-black mt-3' /></div>
                        </div> : shipUpgrade ?
                            <div className="relative bg-white flex flex-col justify-center text-center p-8 max-w-md mx-auto rounded shadow-lg">
                                <h1 className='text-2xl font-bold text-slate-600'>Your NFT has been upgraded.</h1>
                            </div> :
                            <div className="relative bg-white p-8 max-w-md mx-auto rounded shadow-lg">
                                <h1 className='text-xl font-medium my-2 mb-7'>You can perform following actions.</h1>
                                {contractAddress === shipAddress.toLowerCase() ? <button onClick={() => {
                                    setOption(2);
                                    points < 200 && balance < 50? null: sendData();
                                }} className='px-2 py-2 font-medium text-white bg-black hover:bg-gray-800 rounded mx-2' >Upgrade</button> : null}
                                <button onClick={() => {
                                    setOption(1)
                                }} className='px-2 py-2 font-medium text-white bg-green-500 hover:bg-emerald-500 rounded mx-2'>Transfer</button>
                                <button onClick={() => {
                                    setLoading(true);
                                    setOption(0);
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
                                    : option === 2 ?
                                        <div className='mt-6'>
                                            {balance < 50 || points < 200 ? <p className='my-2 text-red-500 font-medium'>You need to hold 50 $IPX and have 200 points to upgrade.</p> : null}
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
                            </div>}
                </>
            }
        </div>
    );
};

export default DialogBox;
