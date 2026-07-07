import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cart id is required',
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      'http://nextlayer.soon.it/api/Cart/clear.php',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
        }),
      }
    );

    const data = await res.json();

    if (!data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || 'Failed to delete cart item',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data.message,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}