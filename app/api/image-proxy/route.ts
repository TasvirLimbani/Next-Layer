import { NextRequest } from 'next/server';

const BASE_IMAGE_HOST = 'http://nextlayer.soon.it';

function parsePossiblyWrappedUrl(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return String(parsed[0] ?? '').trim();
      }

      if (typeof parsed === 'object' && parsed) {
        const obj = parsed as { url?: unknown; image?: unknown; image_url?: unknown };
        return String(obj.url ?? obj.image ?? obj.image_url ?? '').trim();
      }
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function normalizeProxyUrl(raw: string): string | null {
  let value = parsePossiblyWrappedUrl(raw)
    .replace(/^['\"]+|['\"]+$/g, '')
    .replace(/\\/g, '')
    .trim();

  if (value.includes(',')) {
    const firstUrl = value
      .split(',')
      .map((part) => part.trim())
      .find((part) => part.length > 0);

    value = firstUrl ?? '';
  }

  if (!value) {
    return null;
  }

  value = value
    .replace(/^https?:\/\/localhost(?::\d+)?/i, BASE_IMAGE_HOST)
    .replace(/^https?:\/\/nextlayer\.soon\.it/i, BASE_IMAGE_HOST);

  if (value.startsWith('//')) {
    value = `http:${value}`;
  } else if (value.startsWith('/')) {
    value = `${BASE_IMAGE_HOST}${value}`;
  } else if (!/^https?:\/\//i.test(value)) {
    value = `${BASE_IMAGE_HOST}/images/${value.replace(/^images\//i, '').replace(/^\/+/, '')}`;
  }

  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get('url');

  if (!rawUrl) {
    return new Response('Missing URL', { status: 400 });
  }

  const url = normalizeProxyUrl(rawUrl);

  if (!url) {
    return new Response('Invalid URL', { status: 400 });
  }

  const response = await fetch(url);

  if (!response.ok) {
    return new Response('Failed to fetch image', { status: response.status });
  }

  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type':
        response.headers.get('content-type') || 'image/jpeg',
    },
  });
}