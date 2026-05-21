import { NextResponse } from "next/server";

// ==========================
// GET: List Products
// ==========================
export async function GET() {
  try {
    const response = await fetch(
      "http://nextlayer.soon.it/api/Products/list.php",
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
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}