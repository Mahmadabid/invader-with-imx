import connectDb from "@/utils/db/mongodb";
import Invader from "@/utils/db/model";
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { getKeyId } from "@/components/key";

const getPublicKey = async () => {
    const client = jwksClient({ jwksUri: 'https://auth.immutable.com/.well-known/jwks.json' });

    const key = await getKeyId();

    return new Promise<string>((resolve, reject) => {
        const keyId = key;

        client.getSigningKey(keyId, (err, key) => {
            if (err) {
                reject(err);
            } else {
                const signingKey = key?.getPublicKey();
                if (signingKey) {
                    resolve(signingKey);
                }
            }
        });
    });
};

const verifyJwt = async (token: string) => {
    try {
        const publicKey: string = await getPublicKey();

        return new Promise((resolve, reject) => {
            jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching public key:', error);
        throw new Error('Failed to verify JWT');
    }
};

type InvaderEntry = {
    userId: string;
    data: {
        IPX: number;
        Address: string;
        TotalPoints: number;
    };
    userProvider: 'metamask' | 'passport';
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

    if (req.method === 'POST') {
        const { userId, data, userProvider } = req.body as InvaderEntry;

        if (!userId || !data || !userProvider) {
            return res.status(400).json({ error: "Required fields are missing." });
        }

        try {
            if (req.headers.authorization) {
                if (userProvider === 'passport') {
                    const decodedToken = await verifyJwt(req.headers.authorization.split(' ')[1]);
                    if (!decodedToken) {
                        return res.status(401).json({ error: 'Unauthorized' });
                    }
                }

                if (userProvider === 'metamask') {
                    if (process.env.JWT !== req.headers.authorization.split(' ')[1]) {
                        return res.status(401).json({ error: 'Unauthorized' });
                    }
                }

                const existingPointsEntry = await Invader.findOne({ userId });

                if (existingPointsEntry) {

                    existingPointsEntry.data.IPX += data.IPX;
                    existingPointsEntry.data.TotalPoints += data.TotalPoints;

                    await existingPointsEntry.save();

                    return res.status(200).json({ message: "Invader entry updated", entry: existingPointsEntry });
                } else {
                    const newPointsEntry = await Invader.create({ userId, data });

                    return res.status(201).json({ message: "Invader entry created", entry: newPointsEntry });
                }
            }
            return res.status(401).json({ error: 'Unauthorized' });
        } catch (error) {
            console.log('error')
            return res.status(500).json({ error: "Error creating/updating points entry." });
        }
    } else if (req.method === 'GET') {
        const userId = req.query.userId as string;

        if (!userId) {
            return res.status(400).json({ error: "UserId is required." });
        }

        try {
            const userData = await Invader.find({ userId: userId });

            if (!userData.length) {
                return res.status(404).json({ error: "No data found for the given userId." });
            }

            return res.status(200).json({ entries: userData });
        } catch (error) {
            return res.status(500).json({ error: "Error fetching user points data." });
        }

    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
