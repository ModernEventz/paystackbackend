// /pages/api/paystack/initialize.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

// /pages/api/paystack/initialize.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' }); // ✅ valid JSON
  }

  const { email, amount, metadata } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ message: 'Email and amount are required' }); // ✅ valid JSON
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount,
        metadata: metadata || {},
        callback_url: 'https://moderneventsgh.com',
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data:any = response.data;

    return res.status(200).json({
      authorization_url: data.authorization_url,
      reference: data.reference,
    }); // ✅ valid JSON
  } catch (error: any) {
    console.error('Paystack error:', error.response?.data || error.message);

    return res.status(500).json({
      message: 'Failed to initialize transaction',
      error: error.response?.data || error.message,
    }); // ✅ valid JSON even on error
  }
}
