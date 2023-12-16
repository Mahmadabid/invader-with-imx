import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Load from '../utils/Load';

interface AchievementsProps {
    burnBalance: string;
    TotalPoints: number | undefined;
    walletIPX: string;
}

const Achievements: React.FC<AchievementsProps> = ({ burnBalance, TotalPoints, walletIPX }) => {

    const getBurnBadgeCount = () => {
        const balance = parseInt(burnBalance, 10);
        if (balance >= 300) {
            return 3;
        } else if (balance >= 150) {
            return 2;
        } else if (balance >= 50) {
            return 1;
        } else {
            return 0;
        }
    };

    const getPointsBadgeCount = () => {
        const balance = TotalPoints ? TotalPoints : 0;
        if (balance >= 300) {
            return 3;
        } else if (balance >= 150) {
            return 2;
        } else if (balance >= 50) {
            return 1;
        } else {
            return 0;
        }
    };

    const getHolderBadgeCount = () => {
        const balance = parseInt(walletIPX, 10);
        if (balance >= 300) {
            return 3;
        } else if (balance >= 150) {
            return 2;
        } else if (balance >= 50) {
            return 1;
        } else {
            return 0;
        }
    };

    const badgeCount = getBurnBadgeCount();
    const PointsBadgeCount = getPointsBadgeCount();
    const HolderBadgeCount = getHolderBadgeCount();

    return (
        <div>
            <h1 className='text-3xl font-bold'>Achievements</h1>
            <h1 className="text-2xl mt-4 font-bold text-orange-500">Burn Badge</h1>
            {!burnBalance ? <div className='flex justify-center mt-8 pb-8'><Load className='fill-white w-10 h-10' /></div> :
                <>
                    {badgeCount < 3 && (
                        <div className="mt-4 text-xl bg-black opacity-70 w-fit px-2 mx-auto">
                            {parseInt(burnBalance) < 50 ?
                                `Burn ${50 - parseInt(burnBalance)} $IPX for level 1` : parseInt(burnBalance) < 150 ?
                                    `Burn ${150 - parseInt(burnBalance)} $IPX for level 2` : parseInt(burnBalance) < 300 ?
                                        `Burn ${300 - parseInt(burnBalance)} $IPX for level 3` : null}
                        </div>
                    )}


                    <div className="flex flex-wrap text-center items-center mt-10 justify-center">
                        {Array.from({ length: badgeCount }).map((_, index) => (
                            <div key={index} className={`relative flex-shrink-0 w-40 h-40`}>
                                <Image src={`./lvl${index + 1}.svg`} alt={`level ${index + 1}`} width={70} height={70} />
                            </div>
                        ))}

                        {badgeCount < 3 ?
                            <div className={`relative flex justify-center items-center flex-shrink-0 w-40 h-40`}>
                                <div className={`relative flex-shrink-0 w-40 h-40 opacity-60`}>
                                    <Image src="./lvlx.svg" alt={`levelx`} width={70} height={70} />
                                </div>
                            </div>
                            : null}

                        <div className="relative pt-7 pr-8 w-40 h-40">
                            <Link href='/swap'>
                                <button className="font-bold text-2xl bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition duration-300">Burn</button>
                            </Link>
                        </div>
                    </div>
                </>}

            <div className='my-6 border-b-2 border-green-500 mx-6' />

            <h1 className="text-2xl mt-4 font-bold text-green-500">Points Badge</h1>
            {TotalPoints == undefined ? <div className='flex justify-center mt-8 pb-8'><Load className='fill-white w-10 h-10' /></div> :
                <>
                    {PointsBadgeCount < 3 && (
                        <div className="mt-4 text-xl bg-black opacity-70 w-fit px-2 mx-auto">
                            {TotalPoints < 50 ?
                                `Get ${50 - TotalPoints} points for level 1` : TotalPoints < 150 ?
                                    `Get ${150 - TotalPoints} points for level 2` : TotalPoints < 300 ?
                                        `Get ${300 - TotalPoints} points for level 3` : null}
                        </div>
                    )}
                    <div className="flex flex-wrap text-center items-center mt-10 justify-center">
                        {Array.from({ length: PointsBadgeCount }).map((_, index) => (
                            <div key={index} className="relative flex-shrink-0 w-40 h-40 pt-2">
                                <Image src={`./Points${index + 1}.svg`} alt={`level ${index + 1}`} width={70} height={70} />
                            </div>
                        ))}

                        {PointsBadgeCount < 3 ?
                            <div className="relative flex-shrink-0 w-40 h-40 pt-2">
                                <div className="relative flex-shrink-0 w-full h-full opacity-60">
                                    <Image src="./Pointsx.svg" alt={`levelx`} width={70} height={70} />
                                </div>
                            </div>
                            : null}

                        <div className="relative pr-8 w-40 h-40">
                            <Link href='/'>
                                <button className="font-bold text-2xl bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300">Play</button>
                            </Link>
                        </div>
                    </div>


                </>}

            <div className='my-6 border-b-2 border-blue-500 mx-6' />

            <h1 className="text-2xl mt-4 font-bold text-blue-500">Holder Badge</h1>
            {!walletIPX ? <div className='flex justify-center mt-8 pb-8'><Load className='fill-white w-10 h-10' /></div> :
                <>
                    {HolderBadgeCount < 3 && (
                        <div className="mt-4 text-xl bg-black opacity-70 w-fit px-2 mx-auto">
                            {parseInt(walletIPX) < 50 ?
                                `Hold ${50 - parseInt(walletIPX)} $IPX for level 1` : parseInt(walletIPX) < 150 ?
                                    `Hold ${150 - parseInt(walletIPX)} $IPX for level 2` : parseInt(walletIPX) < 300 ?
                                        `Hold ${300 - parseInt(walletIPX)} $IPX for level 3` : null}
                        </div>
                    )}


                    <div className="flex flex-wrap text-center items-center mt-10 justify-center">
                        {Array.from({ length: HolderBadgeCount }).map((_, index) => (
                            <div key={index} className={`relative flex-shrink-0 w-40 h-40`}>
                                <Image src={`./bag${index + 1}.svg`} alt={`level ${index + 1}`} width={70} height={70} />
                            </div>
                        ))}

                        {HolderBadgeCount < 3 ?
                            <div className={`relative flex justify-center items-center flex-shrink-0 w-40 h-40`}>
                                <div className={`relative flex-shrink-0 w-40 h-40 opacity-60`}>
                                    <Image src="./bagx.svg" alt={`levelx`} width={70} height={70} />
                                </div>
                            </div>
                            : null}

                        <div className="relative pt-7 pr-8 w-40 h-40">
                            <Link href='/swap'>
                                <button className="font-bold text-2xl bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">Buy</button>
                            </Link>
                        </div>
                    </div>
                </>}
        </div>
    );
};

export default Achievements;
