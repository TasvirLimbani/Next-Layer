import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const response = await fetch(
      `http://nextlayer.soon.it/api/Filament/detail.php?slug=${encodeURIComponent(
        slug
      )}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: false,
        message: 'Failed to fetch filament details',
      },
      { status: 500 }
    );
  }
}