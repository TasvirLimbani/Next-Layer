import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'http://nextlayer.soon.it/api/Filament/get.php',
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Filament list fetch failed:', error);

    return NextResponse.json(
      {
        status: false,
        message: 'Failed to fetch filament list',
        data: [],
      },
      { status: 500 }
    );
  }
}
