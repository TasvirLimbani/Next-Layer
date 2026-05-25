import { NextRequest, NextResponse } from "next/server";

// ======================================
// GET: Order History
// ======================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        {
          status: false,
          message: "user_id is required",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      `http://nextlayer.soon.it/api/Orders/history.php?user_id=${user_id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Order History Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to fetch order history",
      },
      { status: 500 }
    );
  }
}