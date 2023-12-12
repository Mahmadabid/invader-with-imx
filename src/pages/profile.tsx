import Acheivements from '@/components/profile/Acheivements';
import Claim from '@/components/profile/Claim';
import WalletInfo from '@/components/profile/WalletInfo';
import Load from '@/components/utils/Load';
import { getProfileInfo, passportInstance } from '@/utils/immutable';
import React, { useState, useEffect } from 'react'

export default function Profile() {
    const [user, setUser] = useState<{ Email: string | undefined; Sub: string | undefined } | undefined>(undefined);
    const [walletAddress, setWalletAddress] = useState('');
    const [walletBalance, setWalletBalance] = useState('');
    const [burnBalance, setBurnBalance] = useState('');
    const [walletIPX, setWalletIPX] = useState('');
    const [claimTxn, setClaimTxn] = useState(false);
    const [claimLoad, setClaimLoad] = useState(false);

    const fetchUser = async () => {
        try {
            const userProfile = await passportInstance.getUserInfo();

            setUser({
                Email: userProfile?.email,
                Sub: userProfile?.sub,
            });

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (claimTxn) {
            return;
        };
        setClaimLoad(true);

        if (user) {
            const fetchWalletInfo = async () => {
                const info = await getProfileInfo();
                setWalletAddress(info.walletAddress ? info.walletAddress : '');
                setWalletBalance(info.balanceInEther ? info.balanceInEther : '');
                setWalletIPX(info.tokenBalance ? info.tokenBalance : '');
                setBurnBalance(info.burnBalance ? info.burnBalance : '');
                setClaimLoad(false);
            };

            fetchWalletInfo();
        }
        
    }, [user, claimTxn]);

    const headerHeight = 4.6;

    return (
        <div className="bg-gray-950 text-white text-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
            <div className='font-bold text-2xl py-4'>
                <h1>Hello {user?.Email ?? 'there'} 👋 </h1>
            </div>
            {user && (
                <>
                    <div className="flex ml-5 my-2 flex-row justify-center">
                        <p className='font-bold p-1'>Email: &nbsp;</p>
                        <div className='px-1 text-center truncate break-words w-full xsm:w-96 mx-1 h-10 py-2 bg-black rounded opacity-70'>
                            {user.Email}
                        </div>
                    </div>
                    <WalletInfo address={walletAddress} claimLoad={claimLoad} balance={walletBalance} IPXBalance={walletIPX} burnBalance={burnBalance} />
                </>
            )}
            <div className='my-6 border-b-2 border-white mx-6' />
            <div>
                {claimTxn ? <div className='justify-center flex'><Load /></div> :
                    <Claim Sub={user?.Sub} walletAddress={walletAddress} setClaimTxn={setClaimTxn} ClaimTxn={claimTxn} />}
            </div>
            <div className='my-6 border-b-2 border-white mx-6' />
            <div>
                <Acheivements burnBalance={burnBalance} />
            </div>
        </div>
    );
}
