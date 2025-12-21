import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing URL', { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new NextResponse(response.statusText, { status: response.status });
    }
    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Proxy image error:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
