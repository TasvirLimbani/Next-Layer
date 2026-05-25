import { NextRequest, NextResponse } from 'next/server';

// ======================
// GET - Wishlist
// ======================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'user_id is required',
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      `http://nextlayer.soon.it/api/Wishlist/get.php?user_id=${user_id}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    const data = await res.json();
    const wishlist =
      (Array.isArray(data?.wishlist) && data.wishlist) ||
      (Array.isArray(data?.products) && data.products) ||
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data?.result) && data.result) ||
      [];

    if (!data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch wishlist',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        success: true,
        wishlist,
        products: wishlist,
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

// ======================
// POST - Add Wishlist
// ======================
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let user_id: string | number | null = null;
    let product_id: string | number | null = null;
    let upstreamBody: FormData | string | null = null;

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      user_id = formData.get('user_id')?.toString() || null;
      product_id = formData.get('product_id')?.toString() || null;

      const forwardFormData = new FormData();
      forwardFormData.append('user_id', user_id || '');
      forwardFormData.append('product_id', product_id || '');
      upstreamBody = forwardFormData;
    } else {
      const body = await req.json();
      user_id = body?.user_id ?? null;
      product_id = body?.product_id ?? null;

      upstreamBody = JSON.stringify({
        user_id,
        product_id,
      });
    }

    if (!user_id || !product_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'user_id and product_id are required',
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      'http://nextlayer.soon.it/api/Wishlist/add.php',
      {
        method: 'POST',
        body: upstreamBody,
      }
    );

    const data = await res.json();

    if (!data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || 'Failed to add wishlist',
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

// ======================
// DELETE - Remove Wishlist
// ======================
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const { user_id, product_id } = body;

    if (!user_id || !product_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'user_id and product_id are required',
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      'http://nextlayer.soon.it/api/Wishlist/delete.php',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          product_id,
        }),
      }
    );

    const data = await res.json();

    if (!data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || 'Failed to remove wishlist',
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