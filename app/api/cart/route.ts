import { NextRequest, NextResponse } from 'next/server';

// ======================
// GET - List Cart
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
      `http://nextlayer.soon.it/api/Cart/list.php?user_id=${user_id}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    const data = await res.json();

    if (!data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch cart list',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        grand_total: data.grand_total,
        total_quantity: data.total_quantity,
        cart: data.cart,
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
// POST - Add Cart
// ======================
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const user_id = formData.get("user_id")?.toString();
    const sku = formData.get("sku")?.toString();
    const quantity = formData.get("quantity")?.toString();
    const customization = formData.get("customization")?.toString();
    const colour = formData.get("colour")?.toString();
    const diameter = formData.get("diameter")?.toString();
    const weight = formData.get("weight")?.toString();

    const customer_image = formData.get("customer_image") as File | null;

    if (!user_id || !sku || !quantity) {
      return NextResponse.json(
        {
          success: false,
          message: "user_id, sku and quantity are required",
        },
        { status: 400 }
      );
    }

    const phpForm = new FormData();

    phpForm.append("user_id", user_id);
    phpForm.append("sku", sku);
    phpForm.append("quantity", quantity);

    if (customization)
      phpForm.append("customization", customization);

    if (colour)
      phpForm.append("colour", colour);

    if (diameter)
      phpForm.append("diameter", diameter);

    if (weight)
      phpForm.append("weight", weight);

    if (customer_image) {
      phpForm.append("customer_image", customer_image);
    }

    const res = await fetch(
      "http://nextlayer.soon.it/api/Cart/add.php",
      {
        method: "POST",
        body: phpForm,
      }
    );

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json(
        {
          success: false,
          message: data.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message,
    });

  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
// ======================
// DELETE - Delete Cart
// ======================
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cart id is required',
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      'http://nextlayer.soon.it/api/Cart/delete.php',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
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