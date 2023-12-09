import React from 'react';

interface WalletProps {
    address: string;
    balance: string;
}

const WalletInfo: React.FC<WalletProps> = ({ address, balance }) => (
    <>
        <div className="flex flex-row my-2 justify-center">
            <p className='font-bold p-1'>Address: &nbsp;</p>
            <div className='text-center truncate break-words w-full whitespace-normal xsm:w-96 mx-1 p-2 bg-black rounded opacity-70'>
                {address}
            </div>
        </div>
        <div className="flex flex-row my-2 justify-center">
            <p className='font-bold p-1'>Balance: &nbsp;</p>
            <div className='whitespace-normal truncate text-center break-words w-full h-10 xsm:w-96 mx-1 p-2 bg-black rounded opacity-70'>
                {balance}
            </div>
        </div>
    </>
);

export default WalletInfo;
