// Vercel serverless function for NSE company search autocomplete.
// We avoid importing '@vercel/node' so this compiles cleanly in the Angular workspace.
export default async function handler(req: any, res: any) {
  try {
    const query = (req.query?.q as string) || '';

    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Missing search query (q)' });
    }

    const url =
      'https://www.nseindia.com/api/NextApi/search/autocomplete?q=' +
      encodeURIComponent(query.trim());

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json,text/plain,*/*',
        Referer: 'https://www.nseindia.com/',
      },
    });

    if (!response.ok) {
      console.error('NSE search proxy not ok:', response.status, response.statusText);
      return res
        .status(response.status)
        .json({ error: 'Failed to search NSE companies', status: response.status });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('NSE search proxy error:', err);
    res.status(500).json({ error: 'Failed to search NSE companies' });
  }
}

