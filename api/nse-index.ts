import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url =
      'https://www.nseindia.com/api/NextApi/apiClient?functionName=getIndexData&&type=All';

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json,text/plain,*/*',
        Referer: 'https://www.nseindia.com/',
      },
    });

    if (!response.ok) {
      console.error('NSE proxy response not ok:', response.status, response.statusText);
      return res
        .status(response.status)
        .json({ error: 'Failed to fetch NSE data', status: response.status });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('NSE proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch NSE data' });
  }
}

