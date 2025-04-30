import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { redis } from '../../lib/redis';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const result = schema.safeParse({ email });

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error.errors[0].message });
    }

    // Store email in Upstash Redis
    await redis.sadd('waitlist_emails', email);

    return res.status(200).json({ success: true, message: 'Successfully joined the waitlist' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}