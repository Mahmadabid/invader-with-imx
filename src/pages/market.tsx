import { enemyFirepowerupsABI, enemyFirepowerupsAddress } from "@/components/Contracts/EnemyFirePowerupsContract";
import { firepowerupsABI, firepowerupsAddress } from "@/components/Contracts/FirePowerupsContract";
import { healthpowerupsABI, healthpowerupsAddress } from "@/components/Contracts/HealthPowerupsContract";
import { timerpowerupsAddress, timerpowerupsABI } from "@/components/Contracts/TimerPowerupsContract";
import { gameTokenAddress, gameTokenABI } from "@/components/Contracts/TokenContract";
import Card from "@/components/market/Card";
import Load from "@/components/utils/Load";
import { UserContext } from "@/utils/Context";
import { getWalletInfo } from "@/utils/immutable";
import { ethers } from "ethers";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

const Market = () => {

    const [Txn, setTxn] = useState(false);
    const [Hash, setHash] = useState('');
    const [Approve, setApprove] = useState(false);
    const [TxnError, setTxnError] = useState('');
    const [walletBalance, setWalletBalance] = useState('');
    const [walletIPX, setWalletIPX] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
    const [User, _] = useContext(UserContext);

    const fetchWalletInfo = async () => {
        try {
          const info = await getWalletInfo(User);
          setWalletBalance(info.balanceInEther || '');
          setWalletIPX(info.tokenBalance || '');
          setSigner(info.signer);
          setWalletAddress(info.walletAddress || '')
          setLoading(false);
        } catch (error) {
          console.error('Error fetching wallet info:', error);
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchWalletInfo();
      }, []);

    async function getNextTokenId(contractType: string) {
        try {

            const contract = new ethers.Contract(contractType === 'health'? healthpowerupsAddress: contractType === 'fire'? firepowerupsAddress: contractType === 'timer'? timerpowerupsAddress: enemyFirepowerupsAddress, contractType === 'health'? healthpowerupsABI: contractType === 'fire'? firepowerupsABI: contractType === 'timer'? timerpowerupsABI: enemyFirepowerupsABI, signer);
    
            const totalSupply = await contract.getTotalMint();
            return totalSupply.toNumber() + 1;
    
        } catch (error) {
            console.error('Error getting next token ID:', error);
            return null;
        }
    }

    const handleHealthBuy = async () => {
        setTxn(true);

        if (!signer) {
            console.error('Signer not available');
            return;
        }

        try {
            const contract = new ethers.Contract(healthpowerupsAddress, healthpowerupsABI, signer);
            const gameToken = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);

            const burnToken = ethers.utils.parseEther('30');
            const burnApprove = ethers.utils.parseEther('31');

            const gasPrice = ethers.utils.parseUnits('10', 'gwei');

            if (parseFloat(walletIPX) < 30) {
                setTxnError('You dont have enough IPX');
                return;
              }
        
              if (parseFloat(walletBalance) < 0.013) {
                setTxnError('You dont have enough tIMX');
                return;
              }

            setApprove(true);

            const approveTx = await gameToken.approve(healthpowerupsAddress, burnApprove);
            await approveTx.wait();

            setApprove(false);

            const TokenID = getNextTokenId('health')

            const transaction = await contract.mint(walletAddress, TokenID, burnToken, {
                gasPrice: gasPrice,
            });
            
            const receipt = await transaction.wait();

            setHash(await receipt.transactionHash)

            console.log('Sell successful!');
        } catch (error: any) {
            setTxnError(error.message)
        }
    };

    const handleTimeBuy = async () => {
        setTxn(true);

        if (!signer) {
            console.error('Signer not available');
            return;
        }

        try {
            const contract = new ethers.Contract(timerpowerupsAddress, timerpowerupsABI, signer);
            const gameToken = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);

            const burnToken = ethers.utils.parseEther('30');
            const burnApprove = ethers.utils.parseEther('31');

            const gasPrice = ethers.utils.parseUnits('10', 'gwei');

            if (parseFloat(walletIPX) < 30) {
                setTxnError('You dont have enough IPX');
                return;
              }
        
              if (parseFloat(walletBalance) < 0.013) {
                setTxnError('You dont have enough tIMX');
                return;
              }

            setApprove(true);

            const approveTx = await gameToken.approve(timerpowerupsAddress, burnApprove);
            await approveTx.wait();

            setApprove(false);

            const TokenID = getNextTokenId('timer')

            const transaction = await contract.mint(walletAddress, TokenID, burnToken, {
                gasPrice: gasPrice,
            });
            const receipt = await transaction.wait();

            setHash(await receipt.transactionHash)

            console.log('Sell successful!');
        } catch (error: any) {
            setTxnError(error.message)
        }
    };

    const handleFireBuy = async () => {
        setTxn(true);

        if (!signer) {
            console.error('Signer not available');
            return;
        }

        try {
            const contract = new ethers.Contract(firepowerupsAddress, firepowerupsABI, signer);
            const gameToken = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);

            const burnToken = ethers.utils.parseEther('30');
            const burnApprove = ethers.utils.parseEther('31');

            const gasPrice = ethers.utils.parseUnits('10', 'gwei');

            if (parseFloat(walletIPX) < 30) {
                setTxnError('You dont have enough IPX');
                return;
              }
        
              if (parseFloat(walletBalance) < 0.013) {
                setTxnError('You dont have enough tIMX');
                return;
              }

            setApprove(true);

            const approveTx = await gameToken.approve(firepowerupsAddress, burnApprove);
            await approveTx.wait();

            setApprove(false);

            const TokenID = getNextTokenId('fire')

            const transaction = await contract.mint(walletAddress, TokenID, burnToken, {
                gasPrice: gasPrice,
            });
            const receipt = await transaction.wait();

            setHash(await receipt.transactionHash)

            console.log('Sell successful!');
        } catch (error: any) {
            setTxnError(error.message)
        }
    };

    const handleEnemyFireBuy = async () => {
        setTxn(true);

        if (!signer) {
            console.error('Signer not available');
            return;
        }

        try {
            const contract = new ethers.Contract(enemyFirepowerupsAddress, enemyFirepowerupsABI, signer);
            const gameToken = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);

            const burnToken = ethers.utils.parseEther('30');
            const burnApprove = ethers.utils.parseEther('31');

            const gasPrice = ethers.utils.parseUnits('10', 'gwei');

            if (parseFloat(walletIPX) < 30) {
                setTxnError('You dont have enough IPX');
                return;
              }
        
              if (parseFloat(walletBalance) < 0.013) {
                setTxnError('You dont have enough tIMX');
                return;
              }

            setApprove(true);

            const approveTx = await gameToken.approve(enemyFirepowerupsAddress, burnApprove);
            await approveTx.wait();

            setApprove(false);

            const TokenID = getNextTokenId('enemy')

            const transaction = await contract.mint(walletAddress, TokenID, burnToken, {
                gasPrice: gasPrice,
            });
            const receipt = await transaction.wait();

            setHash(await receipt.transactionHash)

            console.log('Sell successful!');
        } catch (error: any) {
            setTxnError(error.message)
        }
    };

    return (
        <div>
            {Txn ? (
                <>
                    <div className='flex rounded mt-20 flex-col break-all items-center justify-center'>
                        <div
                            className="opacity-70 bg-gray-300 p-5 max-w-2xl"
                        >
                            <div>
                                {Hash?.length === 0 ? (
                                    TxnError ? (
                                        <div className="flex flex-col font-bold text-center items-center justify-center">
                                            <p className="text-xl text-red-600">{TxnError}</p>
                                            <p className="mt-4 text-blue-800 text-xl">Please Try Again <br/> <span className="text-orange-600 text-lg">Make Sure you have allowed pop-ups</span></p>
                                        </div>
                                    ) : !Approve ? (
                                        <div className="flex flex-col font-bold items-center mb-2">
                                            <h3 className="text-xl text-gray-600 mb-2">Waiting for Transaction</h3>
                                            <Load className='w-7 h-7 mt-6 fill-gray-800' />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col font-bold items-center mb-2 px-10">
                                            <h3 className="text-xl text-gray-600 mb-2">Approving</h3>
                                            <Load className='w-7 h-7 mt-6 fill-gray-800' />
                                        </div>)
                                ) : (
                                    <>
                                        <div className="flex flex-col font-bold items-center mb-2">
                                            <p className="text-xl text-gray-600 mb-2">Purchase Was Successful</p>
                                            <p className="border-b border-gray-300 pb-2 mr-2 flex-grow">
                                                <span className="font-bold flex flex-row items-center">Hash:&nbsp;{Hash}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col text-center justify-center mt-2">
                                            <p className="text-green-700 text-xl font-bold my-2">Success</p>
                                            <Link href="/inventory">
                                                <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold px-4 py-2 rounded mt-2">
                                                    View in Inventory page
                                                </button>
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : loading? <div className="justify-center flex mt-20"><Load className="w-8 h-8 fill-black" /></div>:
                <div className="text-center">
                    <h1 className="text-6xl font-bold mt-5 mb-10">Market</h1>
                    <div className="flex flex-wrap justify-center">
                        <Card image="/health.png" name="Extra Heatlh" price="30" onButtonClick={handleHealthBuy} />
                        <Card image="/Bullets.png" name="Faster Firing" price="30" onButtonClick={handleFireBuy} />
                        <Card image="/time.png" name="Extra Time +5 sec" price="30" onButtonClick={handleTimeBuy} />
                        <Card image="/EnemyBullet.png" name="Slower Enemy Firing" price="30" onButtonClick={handleEnemyFireBuy} />
                        <Card image="/gray.png" name="Coimg Soon" price="0" onButtonClick={() => { }} />
                    </div>
                </div>
            }
        </div>
    )
}

export default Market