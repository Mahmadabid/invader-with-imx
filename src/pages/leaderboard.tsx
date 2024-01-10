import Load from "@/components/utils/Load";
import { getLeaderBoard } from "@/utils/immutable";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

type ValueMap = Record<string, number | string>;

type FetchProps = {
    userId: string;
    data: {
        IPX: number;
        Address: string;
        TotalPoints: number;
    },
};

const Leaderboard = () => {
    const [ActiveTab, setActiveTab] = useState(0);
    const [PointsLoading, setPointsLoading] = useState(true);
    const [ContractLoading, setContractLoading] = useState(true);
    const [addressPointsMap, setAddressPointsMap] = useState<ValueMap>({});
    const [buyIPXMap, setBuyIPXMap] = useState<ValueMap>({});
    const [burnIPXMap, setBurnIPXMap] = useState<ValueMap>({});

    const headerHeight = 4.6;

    useEffect(() => {
        const fetchData = async () => {
            setPointsLoading(true);
            const url = `/api/fetchall`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                const transformedData = data.entries.reduce((acc: ValueMap, entry: FetchProps) => {
                    const { Address, TotalPoints } = entry.data;
                    acc[Address] = TotalPoints;
                    return acc;
                }, {});

                const sortedData = Object.entries(transformedData)
                    .sort((a: any, b: any) => b[1] - a[1])
                    .reduce((acc: any, [address, totalPoints]) => {
                        acc[address] = totalPoints;
                        return acc;
                    }, {});

                setAddressPointsMap(sortedData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
            setPointsLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchContract = async () => {
            setContractLoading(true);
            const fetchResult = await getLeaderBoard();
            const transformedData = fetchResult?.BuyBalance.reduce((acc: ValueMap, [address, value]: [string, string]) => {

                acc[address] = ethers.utils.formatEther(value);
                return acc;
            }, {});

            const sortedData = Object.entries(transformedData)
                .sort((a: any, b: any) => b[1] - a[1])
                .reduce((acc: any, [address, value]) => {
                    acc[address] = value;
                    return acc;
                }, {});

            setBuyIPXMap(sortedData);

            const [burnAddresses, burnPointsArray] = fetchResult?.burnLeaderboard || [[], []];

            const transformedBurnData = burnAddresses.reduce((acc: ValueMap, address: string, index: number) => {
                const pointsObject = burnPointsArray[index];

                acc[address] = ethers.utils.formatEther(pointsObject);
                return acc;
            }, {});


            const sortedBurnData = Object.entries(transformedBurnData)
                .sort((a: any, b: any) => b[1] - a[1])
                .reduce((acc: any, [address, value]) => {
                    acc[address] = value;
                    return acc;
                }, {});

            setBurnIPXMap(sortedBurnData);
            setContractLoading(false);
        };
        fetchContract();
    }, []);

    return (
        <div className="bg-gray-950 text-white text-center pb-1" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
            <h1 className="text-6xl py-10 font-bold">Leaderboard</h1>
            <button onClick={() => setActiveTab(0)} className="font-bold text-2xl bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300">Player</button>
            <button onClick={() => setActiveTab(1)} className="font-bold m-2 text-2xl bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition duration-300">Burn</button>
            <button onClick={() => setActiveTab(2)} className="font-bold text-2xl bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">Buyer</button>

            {ActiveTab === 0 ?
                <div className="">
                    <h1 className="text-3xl font-bold mt-3 text-green-500">Player</h1>
                    {PointsLoading ? <div className="flex justify-center my-5"><Load /></div> :
                        <div className="relative flex justify-center my-3 overflow-x-auto">
                            <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Rank</th>
                                        <th scope="col" className="px-6 py-3">Address</th>
                                        <th scope="col" className="px-6 py-3">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(addressPointsMap).map(([address, value], index) => (
                                        <tr key={index}>
                                            <td scope="row" className="px-6 py-4 font-medium">{index + 1}</td>
                                            <td scope="row" className="px-6 py-4 font-medium">{address}</td>
                                            <td scope="row" className="px-6 py-4 font-medium">{value}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>}
                </div>
                : ActiveTab === 1 ?
                    <div>
                        <h1 className="text-3xl font-bold mt-3 text-orange-500">Burn</h1>
                        {ContractLoading ? <div className="flex justify-center my-5"><Load /></div> : <div className="relative flex justify-center my-3 overflow-x-auto">
                            <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Rank</th>
                                        <th scope="col" className="px-6 py-3">Address</th>
                                        <th scope="col" className="px-6 py-3">IPX</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(burnIPXMap).map(([address, value], index) => (
                                        <tr key={index}>
                                            <td scope="row" className="px-6 py-4 font-medium">{index + 1}</td>
                                            <td scope="row" className="px-6 py-4 font-medium">{address}</td>
                                            <td scope="row" className="px-6 py-4 font-medium">{value}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>}
                    </div>
                    : <div>
                        <h1 className="text-3xl font-bold mt-3 text-blue-500">Buyer</h1>
                        {ContractLoading ? <div className="flex justify-center my-5"><Load /></div> : <div className="relative flex justify-center my-3 overflow-x-auto">
                            <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Rank</th>
                                        <th scope="col" className="px-6 py-3">Address</th>
                                        <th scope="col" className="px-6 py-3">IPX</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(buyIPXMap).map(([address, value], index) => (
                                        <tr key={index}>
                                            <td scope="row" className="px-6 py-4 font-medium">{index + 1}</td>
                                            <td scope="row" className="px-6 py-4 font-medium">{address}</td>
                                            <td scope="row" className="px-6 py-4 font-medium">{value}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>}
                    </div>
            }
        </div>
    );
}

export default Leaderboard;
