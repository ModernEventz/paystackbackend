// /pages/api/paystack/initialize.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, amount, metadata } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ message: 'Email and amount are required' });
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount, // amount in kobo (100 NGN = 10000)
        metadata: metadata || {},
        callback_url: 'https://moderneventsgh.com', // optional
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { data } = response.data;

    return res.status(200).json({ authorization_url: data.authorization_url, reference: data.reference });
  } catch (error: any) {
    console.error('Paystack init error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to initialize transaction' });
  }
}
