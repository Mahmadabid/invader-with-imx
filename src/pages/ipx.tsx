import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Link from 'next/link';
import { signerFetch } from '@/utils/immutable';
import { ethers } from 'ethers';
import { gameTokenAddress, gameTokenABI } from '@/components/Contracts/TokenContract';
import Load from '@/components/utils/Load';

async function getTotalSupply(signer: ethers.Signer): Promise<string>  {
    const tokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);
    return await tokenContract.totalSupply();
}

async function getBurnSupply(signer: ethers.Signer): Promise<string>  {
    const tokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, signer);
    return await tokenContract.totalBurned();
}

const IPXPage = () => {
    const headerHeight = 4.6;
    const chartRef = useRef<HTMLCanvasElement>(null);
    const [total, settotal] = useState(false);
    const [burn, setburn] = useState(false);
    const [totalLoading, setTotalLoading] = useState(false);
    const [burnLoading, setBurnLoading] = useState(false);
    const [burnSupply, setBurnSupply] = useState('');
    const [totalSupply, setTotalSupply] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setTotalLoading(true);
                const signer = await signerFetch();
                const totalSupplyResult = await getTotalSupply(signer);
                setTotalSupply(ethers.utils.formatEther(totalSupplyResult));
            } catch (error) {
                console.error('Error fetching totalSupply:', error);
            } finally {
                setTotalLoading(false);
            }
        };

        fetchData();
    }, [total]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setBurnLoading(true);
                const signer = await signerFetch();
                const burnSupplyResult = await getBurnSupply(signer);
                setBurnSupply(ethers.utils.formatEther(burnSupplyResult));
            } catch (error) {
                console.error('Error fetching burnSupply:', error);
            } finally {
                setBurnLoading(false);
            }
        };

        fetchData();
    }, [burn]);

    useEffect(() => {
        if (!chartRef.current) {
            return;
        }

        const chartData = {
            labels: ['Liquidity', 'Founder'],
            datasets: [{
                data: [99, 1],
                backgroundColor: ['#3490dc', '#f56565'],
            }],
        };

        const ctx = chartRef.current.getContext('2d');

        if (!ctx) {
            return;
        }
        let myChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        return () => {
            if (myChart) {
                myChart.destroy();
            }
        };
    }, []);

    return (
        <div className="bg-gray-950 text-white flex flex-col items-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>

            <h1 className="text-4xl md:text-5xl my-6 font-extrabold">IPX Token Details</h1>

            <div className="flex flex-col md:flex-row items-center justify-center my-4">
                <div className="mr-4">
                    <Image src="/IPX.png" alt="IPX Token" width={150} height={150} />
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='flex flex-row m-1'>
                        <button onClick={() => settotal(prev => !prev)} className="bg-blue-500 text-white px-6 rounded-full hover:bg-blue-600 transition duration-300" disabled={totalLoading}>IPX in Circulation</button>
                        <div className='text-center mx-3 flex justify-center p-2 h-10 w-min-fit bg-black rounded opacity-70'>{totalLoading ? <Load /> : totalSupply}</div>
                    </div>
                    <div className='flex flex-row m-1'>
                        <button onClick={() => setburn(prev => !prev)} className="bg-orange-500 text-white px-6 rounded-full hover:bg-orange-600 transition duration-300" disabled={burnLoading}> IPX Burned</button>
                        <div className='text-center flex justify-center mx-3 p-2 h-10 w-min-fit bg-black rounded opacity-70'>{burnLoading ? <Load /> : burnSupply}</div>
                    </div>
                </div>
            </div>
            <section className="mx-2 text-lg max-w-2xl text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Minting</h2>
                <p>
                    Mint IPX by purchasing it on the swap page or earning it through gameplay in Pixels Invader.
                    This fuels the Pixels Invader ecosystem and contributes to its growth.
                </p>
            </section>

            <canvas ref={chartRef} className="my-4 max-w-sm max-h-44" />

            <section className="mx-2 text-lg my-4 max-w-2xl text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Usage</h2>
                <p>
                    Utilize IPX in the market to buy various in-game items and enhance your Pixels Invader experience.
                </p>
            </section>

            <section className="mx-2 text-lg my-4 max-w-2xl text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Swap</h2>
                <p>
                    The swap offers both the mint and burn of token.
                </p>
            </section>

            <section className="mx-2 text-lg my-4 max-w-2xl text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Token Burning</h2>
                <p>
                    IPX tokens are subject to periodic burning, ensuring a continuous reduction in the token supply.
                    This deflationary mechanism is designed to enhance the scarcity and value of IPX over time.
                    Everytime you buy something in market it gets burned.
                </p>
            </section>

            <div className="my-4">
                <Link
                    href="swap"
                    className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300"
                >
                    Buy IPX on Swap Page
                </Link>
            </div>

            <p className="text-lg my-2">
                Contract Address: <span className="font-mono">{gameTokenAddress}</span>
            </p>
        </div>
    );
};

export default IPXPage;
