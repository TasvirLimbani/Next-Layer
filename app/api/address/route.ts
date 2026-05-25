import { NextRequest, NextResponse } from "next/server";

// ======================================
// GET: Address List
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
      `http://nextlayer.soon.it/api/Addresses/list.php?user_id=${user_id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Address Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to fetch addresses",
      },
      { status: 500 }
    );
  }
}

// ======================================
// POST: Add Address
// ======================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      user_id,
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = body;

    if (
      !user_id ||
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return NextResponse.json(
        {
          status: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      "http://nextlayer.soon.it/api/Addresses/add.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST Address Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to add address",
      },
      { status: 500 }
    );
  }
}

// ======================================
// PUT: Edit Address
// ======================================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      user_id,
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = body;

    if (
      !id ||
      !user_id ||
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return NextResponse.json(
        {
          status: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      "http://nextlayer.soon.it/api/Addresses/edit.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT Address Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to update address",
      },
      { status: 500 }
    );
  }
}

// ======================================
// DELETE: Delete Address
// ======================================
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "id is required",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      `http://nextlayer.soon.it/api/Addresses/delete.php?id=${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("DELETE Address Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to delete address",
      },
      { status: 500 }
    );
  }
}