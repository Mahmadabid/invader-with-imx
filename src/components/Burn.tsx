import { getWalletInfo, signerFetch } from "@/utils/immutable";
import { ethers } from "ethers";
import { ChangeEvent, useEffect, useState } from "react"
import { burnContractAddress } from "./Contracts/BurnContract";
import Load from "./utils/Load";
import { gameTokenABI, gameTokenAddress } from "./Contracts/TokenContract";

interface BurnProps {
    setMint: (value: React.SetStateAction<boolean>) => void;
    setHash: (value: React.SetStateAction<string>) => void;
    setTxnError: (value: React.SetStateAction<string>) => void;
    setSuccess: (value: React.SetStateAction<boolean>) => void;
}

const Burn: React.FC<BurnProps> = ({ setMint, setHash, setSuccess, setTxnError }) => {

    const [burnAmount, setBurnAmount] = useState(0);
    const [walletBalance, setWalletBalance] = useState('');
    const [walletIPX, setWalletIPX] = useState('');
    const [loading, setLoading] = useState(true);

    const handleBurnAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBurnAmount(parseFloat(e.target.value));
    };

    const fetchWalletInfo = async () => {
        const info = await getWalletInfo();
        setWalletBalance(info.balanceInEther ? info.balanceInEther : '');
        setWalletIPX(info.tokenBalance ? info.tokenBalance : '');
        setLoading(false);
    };

    useEffect(() => {
        fetchWalletInfo();
    }, [])

    async function sendBurnTransaction() {
        const signer = await signerFetch();

        if (parseFloat(walletIPX) === 0.0) {
            setTxnError('Your dont have any IPX')
            return;
        }
        else if (parseFloat(walletBalance) === 0.0) {
            setTxnError('Your dont have any tIMX')
            return;
        }
        try {

            const tokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);
    
            const tokenAmount = ethers.utils.parseEther(burnAmount.toString());
            const gasLimit = ethers.utils.parseUnits('10', 'gwei');
    
            const transferTx = await tokenContract.transfer(burnContractAddress, tokenAmount, {
                gasLimit: gasLimit,
            });

            const receipt = await transferTx.wait();
            setHash(await receipt.transactionHash)
 
            setSuccess(true);
            return receipt.transactionHash;
        } catch (error: any) {
            setTxnError(error.message)
        }
    }

    const handleBurn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMint(true);
        sendBurnTransaction();
    }

    return (
        <div className='mt-8 mb-6 text-center'>
            <h1 className='font-bold text-5xl text-white'>Burn</h1>
            <form onSubmit={handleBurn} className='flex flex-row space-x-2 mt-4'>
                <input value={burnAmount} onChange={handleBurnAmountChange} className='px-2 text-white mx-1 h-10 py-1 bg-black rounded opacity-70' type='number' required />
                {loading ?
                    <div className="bg-orange-500 font-bold text-white px-4 py-2 rounded-full hover:bg-orange-600 transition duration-300"><Load /></div> :
                    <button type="submit" disabled={loading || burnAmount === 0} className="bg-orange-500 font-bold text-white px-4 rounded-full hover:bg-orange-600 transition duration-300">Burn</button>
                }
            </form>
            {burnAmount === 0 ? <p className="my-2 font-bold text-red-500">Value should be greator then zero</p> : null}
        </div>
    )
}

export default Burn