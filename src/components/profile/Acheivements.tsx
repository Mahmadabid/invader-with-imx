import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Load from '../utils/Load';

interface AchievementsProps {
    burnBalance: string;
}

const Achievements: React.FC<AchievementsProps> = ({ burnBalance }) => {

    const getBadgeCount = () => {
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

    const badgeCount = getBadgeCount();

    return (
        <div>
            <h1 className='text-3xl font-bold'>Achievements</h1>
            <h1 className='text-2xl mt-4 font-bold'>Burn Badge</h1>
            {!burnBalance ? <div className='flex justify-center mt-8'><Load className='fill-white w-10 h-10'/></div> : 
            <>
                {badgeCount < 3 && (
                    <div className="mt-4 text-xl bg-black opacity-70 w-fit px-2 mx-auto">
                        {parseInt(burnBalance) < 50 ?
                            `Burn ${50 - parseInt(burnBalance)} $IPX for level 1` : parseInt(burnBalance) < 150 ?
                                `Burn ${150 - parseInt(burnBalance)} $IPX for level 2` : parseInt(burnBalance) < 300 ?
                                    `Burn ${300 - parseInt(burnBalance)} $IPX for level 3` : null}
                    </div>
                )}


                <div className="flex flex-wrap gap-4 text-center items-center justify-center">
                    {Array.from({ length: badgeCount }).map((_, index) => (
                        <div key={index} className={`relative flex-shrink-0 w-60 h-60 xb:w-40 xb:h-40`}>
                            <Image src={`./lvl${index + 1}.svg`} alt={`level ${index + 1}`} width={300} height={300} />
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 xb:text-5xl mt-2 text-white text-7xl font-bold">{index + 1}</span>
                        </div>
                    ))}

                    {badgeCount < 3 ?
                        <div className={`relative flex justify-center items-center flex-shrink-0 w-60 h-60 xb:w-40 xb:h-40`}>
                            <div className='border-black border-8 rounded-full bg-black w-32 h-32 xb:w-20 xb:h-20 xb:mt-4 mt-6 border-opacity-90 bg-opacity-70'></div>
                            <span className="absolute top-1/2 left-1/2 transform text-gray-950 -translate-x-1/2 -translate-y-1/2 xb:text-5xl text-7xl mt-2 font-bold">?</span>
                        </div>
                        : null}

                    <div className="relative flex items-center justify-center w-60 h-40 xb:w-40 xb:h-40 mt-4">
                        <Link href='/swap'>
                            <button className="font-bold text-2xl bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition duration-300">Burn</button>
                        </Link>
                    </div>
                </div>
            </>}
        </div>
    );
};

export default Achievements;
