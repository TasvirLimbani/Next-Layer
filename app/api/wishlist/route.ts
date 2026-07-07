import { NextRequest, NextResponse } from 'next/server';

// ======================
// GET - Wishlist
// ======================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        {
          success: false,
          message: "user_id is required",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      `http://nextlayer.soon.it/api/Wishlist/get.php?user_id=${user_id}`,
      {
        cache: "no-store",
      }
    );

    const text = await res.text();

    console.log("Wishlist API Response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON returned from PHP API",
          response: text,
        },
        { status: 500 }
      );
    }

    const wishlist =
      data.wishlist ||
      data.products ||
      data.data?.wishlist ||
      data.result?.wishlist ||
      [];

    return NextResponse.json({
      success: true,
      status: true,
      wishlist,
      products: wishlist,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
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
    const body = await req.json();

    const { user_id, product_id } = body;

    console.log("Received:", body);

    if (!user_id || !product_id) {
      return NextResponse.json(
        {
          success: false,
          message: "user_id and product_id are required",
        },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append("user_id", String(user_id));
    formData.append("product_id", String(product_id));

    const res = await fetch(
      "http://nextlayer.soon.it/api/Wishlist/add.php",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    console.log("PHP Response:", data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
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