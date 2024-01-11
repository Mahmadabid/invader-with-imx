import Acheivements from '@/components/profile/Acheivements';
import Claim from '@/components/profile/Claim';
import WalletInfo from '@/components/profile/WalletInfo';
import Load from '@/components/utils/Load';
import { UserContext } from '@/utils/Context';
import { getMetamaskSub, getProfileInfo, passportInstance } from '@/utils/immutable';
import React, { useState, useEffect, useContext } from 'react'

export default function Profile() {
    const [user, setUser] = useState<{ Email: string | undefined; Sub: string | undefined } | undefined>(undefined);
    const [walletAddress, setWalletAddress] = useState('');
    const [walletBalance, setWalletBalance] = useState('');
    const [burnBalance, setBurnBalance] = useState('');
    const [walletIPX, setWalletIPX] = useState('');
    const [PointsIPX, setPointsIPX] = useState<number | undefined>(undefined);
    const [claimTxn, setClaimTxn] = useState(false);
    const [claimLoad, setClaimLoad] = useState(false);
    const [User, _] = useContext(UserContext);

    const fetchUser = async () => {
        try {
            if (User === 'passport') {
                const userProfile = await passportInstance.getUserInfo();

                setUser({
                    Email: userProfile?.email,
                    Sub: userProfile?.sub,
                });
            }
            if (User === 'metamask') {
                const metamaskSub = await getMetamaskSub();

                setUser({
                        Email: 'User',
                        Sub: metamaskSub,
                    })
            }
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

        const fetchWalletInfo = async () => {
            const info = await getProfileInfo(User);
            setWalletAddress(info.walletAddress ? info.walletAddress : '');
            setWalletBalance(info.balanceInEther ? info.balanceInEther : '');
            setWalletIPX(info.tokenBalance ? info.tokenBalance : '');
            setBurnBalance(info.burnBalance ? info.burnBalance : '');
            setClaimLoad(false);
        };

        fetchWalletInfo();

    }, [user, claimTxn]);

    const headerHeight = 4.6;

    return (
        <div className="bg-gray-950 text-white text-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
            <div>
                <h1 className='font-bold text-2xl pt-4'>Hello {user?.Email ?? 'there'} 👋 </h1>
                <h1 className='font-medium text-xl pb-4 pt-2 text-lime-500'>{User === 'passport' ? 'Immutable Passport' : 'Metamask'}</h1>
            </div>
            {user && (
                <>
                    {User === 'passport' ? <div className="flex ml-5 my-2 flex-row justify-center">
                        <p className='font-bold p-1'>Email: &nbsp;</p>
                        <div className='px-1 text-center truncate break-words w-full xsm:w-96 mx-1 h-10 py-2 bg-black rounded opacity-70'>
                            {user.Email}
                        </div>
                    </div> : null}
                    <WalletInfo address={walletAddress} PointsIPX={PointsIPX} claimLoad={claimLoad} balance={walletBalance} IPXBalance={walletIPX} burnBalance={burnBalance} />
                </>
            )}
            <div className='my-6 border-b-2 border-white mx-6' />
            <div>
                {claimTxn ? <div className='justify-center flex'><Load /></div> :
                    <Claim Sub={user?.Sub} setPointsIPX={setPointsIPX} setClaimTxn={setClaimTxn} ClaimTxn={claimTxn} />}
            </div>
            <div className='my-6 border-b-2 border-white mx-6' />
            <div>
                <Acheivements burnBalance={burnBalance} TotalPoints={PointsIPX} walletIPX={walletIPX} />
            </div>
        </div>
    );
}
