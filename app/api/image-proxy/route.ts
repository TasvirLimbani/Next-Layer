import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing URL', { status: 400 });
  }

  const response = await fetch(url);

  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type':
        response.headers.get('content-type') || 'image/jpeg',
    },
  });
}