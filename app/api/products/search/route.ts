import { NextRequest, NextResponse } from "next/server";

// ==========================
// GET: Search Products
// ==========================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return NextResponse.json(
        {
          status: false,
          message: "Keyword is required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `http://nextlayer.soon.it/api/Products/search.php?keyword=${keyword}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to search products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}