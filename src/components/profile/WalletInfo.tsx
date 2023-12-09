import React from 'react';
import Load from '../utils/Load';

interface WalletProps {
    address: string;
    balance: string;
    IPXBalance: string;
}

const WalletInfo: React.FC<WalletProps> = ({ address, balance, IPXBalance }) => (
    <>
        <div className="flex flex-row my-2 justify-center">
            <p className='font-bold p-1'>Address: &nbsp;</p>
            <div className={`text-center truncate break-words w-full whitespace-normal xsm:w-96 mx-1 p-2 bg-black rounded opacity-70 ${!address? 'flex justify-center': ''}`}>
                {address? address: <Load/>}
            </div>
        </div>
        <div className="flex flex-row my-2 justify-center">
            <p className='font-bold p-1'>Balance: &nbsp;</p>
            <div className='truncate text-center flex justify-center break-words w-full h-10 xsm:w-96 mx-1 p-2 bg-black rounded opacity-70'>
                {balance? balance: <Load/>}
            </div>
        </div>
        <div className="flex flex-row ml-8 my-2 justify-center">
            <p className='font-bold p-1'>IPX: &nbsp;</p>
            <div className='truncate text-center flex justify-center break-words w-full h-10 xsm:w-96 mx-1 p-2 bg-black rounded opacity-70'>
                {IPXBalance? IPXBalance: <Load/>}
            </div>
        </div>
    </>
);

export default WalletInfo;
