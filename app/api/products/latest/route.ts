import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'http://nextlayer.soon.it/api/Products/latest.php',
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    const data = await res.json();

    if (!data?.status) {
      return NextResponse.json(
        {
          status: false,
          message: 'Failed to fetch latest products',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}