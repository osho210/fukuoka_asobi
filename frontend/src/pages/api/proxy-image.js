export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send(response.statusText);
    }
    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Proxy image error:', error);
    res.status(500).send('Error fetching image');
  }
}
