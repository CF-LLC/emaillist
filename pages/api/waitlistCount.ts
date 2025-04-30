import type { NextApiRequest, NextApiResponse } from 'next';
import { redis } from '../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const count = await redis.scard('waitlist_emails');
    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}