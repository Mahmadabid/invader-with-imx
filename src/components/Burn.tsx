import { signerFetch } from "@/utils/immutable";
import { ethers } from "ethers";
import { ChangeEvent, useState } from "react"
import Load from "./utils/Load";
import { gameTokenABI, gameTokenAddress } from "./Contracts/TokenContract";

interface BurnProps {
    setTxn: (value: React.SetStateAction<boolean>) => void;
    setHash: (value: React.SetStateAction<string>) => void;
    setTxnError: (value: React.SetStateAction<string>) => void;
    walletIPX: string;
    walletBalance: string;
    loading: boolean;
}

const Burn: React.FC<BurnProps> = ({ setTxn, setHash, setTxnError, walletBalance, walletIPX, loading }) => {

    const [burnAmount, setBurnAmount] = useState(0);

    const handleBurnAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBurnAmount(parseFloat(e.target.value));
    };

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

            if (parseFloat(walletIPX) < burnAmount) {
                setTxnError('You dont have enough IPX');
                return;
              }
        
              if (parseFloat(walletBalance) < 0.013) {
                setTxnError('You dont have enough tIMX');
                return;
              }
    
            const BurnTx = await tokenContract.burn(tokenAmount, {
                gasLimit: gasLimit,
            });

            const receipt = await BurnTx.wait();
            setHash(await receipt.transactionHash)
 
            return receipt.transactionHash;
        } catch (error: any) {
            setTxnError(error.message)
        }
    }

    const handleBurn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTxn(true);
        sendBurnTransaction();
    }

    return (
        <div className='mt-8 mb-6 text-center'>
            <h1 className='font-bold text-5xl text-white'>Burn</h1>
            <p className="my-3 flex flex-row text-white text-xl font-medium">You have {walletIPX? walletIPX: <Load className="w-5 h-5 fill-white mx-2 mt-1" />} $IPX</p>
            <form onSubmit={handleBurn} className='flex flex-row space-x-2 mt-4'>
                <input value={burnAmount} onChange={handleBurnAmountChange} className='px-2 text-white mx-1 h-10 py-1 bg-black rounded opacity-70' type='number' required />
                {loading ?
                    <div className="bg-orange-500 font-bold text-white px-4 py-2 rounded-full hover:bg-orange-600 transition duration-300"><Load /></div> :
                    <button type="submit" disabled={loading || burnAmount === 0 || burnAmount > parseFloat(walletIPX)} className="bg-orange-500 font-bold text-white px-4 rounded-full hover:bg-orange-600 transition duration-300">Burn</button>
                }
            </form>
            {burnAmount === 0 ? <p className="my-2 font-bold text-red-500">Value should be greator then zero</p> : null}
            {burnAmount > parseFloat(walletIPX) ? <p className="my-2 font-bold text-red-500">You dont have enough Tokens</p> : null}
        </div>
    )
}

export default Burn