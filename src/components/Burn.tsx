import { ChangeEvent, useState } from "react"

interface BurnProps {
    setMint: (value: React.SetStateAction<boolean>) => void;
}

const Burn: React.FC<BurnProps> = ({setMint}) => {

    const [burnAmount, setBurnAmount] = useState(0);

    const handleBurnAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBurnAmount(parseFloat(e.target.value));
    };

    const handleBurn = () => {
        setMint(true);
        
    }

    return (
        <div className='mt-8 mb-6 text-center'>
            <h1 className='font-bold text-5xl text-white'>Burn</h1>
            <div className='flex flex-row space-x-2 mt-4'>
                <input value={burnAmount} onChange={handleBurnAmountChange} className='px-2 text-white mx-1 h-10 py-1 bg-black rounded opacity-70' type='number' />
                <button onClick={handleBurn} className="bg-orange-500 font-bold text-white px-4 rounded-full hover:bg-orange-600 transition duration-300">Burn</button>
            </div>
        </div>
    )
}

export default Burn