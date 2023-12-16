import React, { ChangeEvent, useEffect, useState } from 'react';
import Load from '../utils/Load';
import { passportInstance } from '@/utils/immutable';

interface ClaimProps {
    Sub: string | undefined;
    setClaimTxn: (value: React.SetStateAction<boolean>) => void;
    ClaimTxn: boolean;
    setPointsIPX: (value: React.SetStateAction<number | undefined>) => void;
}

type IPXEntry = {
    userId: string;
    data: {
        IPX: number;
        Address: string
    },
};

type JWTProps = {
    accessToken: string;
    idToken: string;
};

const Claim: React.FC<ClaimProps> = ({ Sub, setClaimTxn, ClaimTxn, setPointsIPX }) => {

    const [Points, setPoints] = useState(0);
    const [Address, setAddress] = useState('');
    const [ClaimPoints, setClaimPoints] = useState(0);
    const [loading, setloading] = useState(false);
    const [jwt, setJwt] = useState<JWTProps>({ accessToken: '', idToken: ''});

    const fetchData = async () => {
        setloading(true);
        const url = `/api/data?userId=${Sub}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.entries && data.entries.length > 0) {
                const { IPX, Address, TotalPoints } = data.entries[0].data || {};
                setPoints(IPX || 0);
                setAddress(Address || '');
                setPointsIPX(TotalPoints || 0)
            } else {
                setPoints(0);
                setAddress('');
                setPointsIPX(0);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        setloading(false);
    };

    useEffect(() => {
        if (Sub && !ClaimTxn) {
            fetchData();
        }
    }, [Sub, ClaimTxn]);

    async function JWT() {
        const idToken = await passportInstance.getIdToken();
        const accessToken = await passportInstance.getAccessToken();

        setJwt({
            accessToken: accessToken? accessToken: '',
            idToken: idToken? idToken: ''
        })        
    }

    useEffect(() => {
        JWT();
    }, [passportInstance])

    const dataToSend: IPXEntry = {
        userId: Sub || '',
        data: {
            IPX: ClaimPoints,
            Address: Address
        },
    }

    const sendData = async () => {
        try {
            const response = await fetch('/api/web3', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) setClaimTxn(false);
            if (!response.ok) throw new Error('Failed to save data');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleClaimAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setClaimPoints(parseFloat(e.target.value));
    }

    const handleClaim = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setClaimTxn(true);
        sendData();
    }

    return (
        <>
            <h1 className='text-3xl font-bold'>Claim</h1>
            <p className='text-white my-2 flex flex-row justify-center'>You have {loading ? <Load className='w-4 h-4 fill-white mx-1 mt-1' /> : Points} unclaimed IPX. Convert them to IPX</p>
            {Points < 200 ?
                <p className='text-red-500 font-medium'>You need atleast 200 points to Claim</p>
                : null}
            <form onSubmit={handleClaim} className='flex flex-row justify-center space-x-2 mt-4'>
                <input value={ClaimPoints} onChange={handleClaimAmountChange} className='px-2 text-white mx-1 h-10 py-1 bg-black rounded opacity-70' type='number' required />
                {loading ?
                    <div className="bg-yellow-500 font-bold text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition duration-300"><Load /></div> :
                    <button type="submit" disabled={loading || Points < 200 || Points < ClaimPoints || ClaimPoints < 200} className="bg-yellow-500 disabled:bg-yellow-800 font-bold text-white px-4 rounded-full hover:bg-yellow-600 transition duration-300">Claim</button>
                }
            </form>
            <p className='font-medium text-red-500 mt-4'>{Points < ClaimPoints? 'Enter value less than or equal to ' + Points: null}</p>
            <p className='font-bold text-red-500 mt-4'>Note: <span className='font-medium'>20% points will be deducted as fee. </span></p>
            <p className='text-white mt-2 font-bold'>You will receive {ClaimPoints ? (ClaimPoints * 80) / 100 : 0}</p>
        </>
    )
}

export default Claim