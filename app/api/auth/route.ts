import { NextRequest, NextResponse } from "next/server";

// ==========================
// POST: User Signup
// ==========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          status: false,
          message: "Name, email and password are required",
        },
        { status: 400 }
      );
    }

    // API Call
    const res = await fetch(
      "http://nextlayer.soon.it/api/Auth/signup.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("Signup API Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

// ==========================
// POST: User Login
// ==========================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          status: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // API Call
    const res = await fetch(
      "http://nextlayer.soon.it/api/Auth/login.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("Login API Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}