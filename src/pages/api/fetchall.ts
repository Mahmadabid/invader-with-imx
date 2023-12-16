import connectDb from "@/utils/db/mongodb";
import Invader from "@/utils/db/model";
import type { NextApiRequest, NextApiResponse } from 'next'

type InvaderEntry = {
    userId: string;
    data: {
        IPX: number;
        Address: string;
        TotalPoints: number;
    }
};

type ApiResponse = {
    error?: string;
    message?: string;
    entry?: InvaderEntry;
    entries?: InvaderEntry[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    await connectDb();

    if (req.method === 'GET') {
        try {
            const allData = await Invader.find();

            if (!allData.length) {
                return res.status(404).json({ error: "No data found in the database." });
            }

            return res.status(200).json({ entries: allData });
        } catch (error) {
            return res.status(500).json({ error: "Error fetching data from the database." });
        }

    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
