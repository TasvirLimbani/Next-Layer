import { NextRequest, NextResponse } from "next/server";

// ======================
// GET - List Cart
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

    const url = `http://nextlayer.soon.it/api/Cart/list.php?user_id=${encodeURIComponent(
      user_id
    )}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const text = await res.text();

    console.log("CART LIST STATUS:", res.status);
    console.log("CART LIST RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "PHP API returned invalid JSON",
          php_response: text,
        },
        { status: 502 }
      );
    }

    if (!res.ok || !data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Failed to fetch cart list",
          php_response: data,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      grand_total: data.grand_total ?? 0,
      total_quantity: data.total_quantity ?? 0,
      cart: data.cart ?? [],
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
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

    const user_id = formData.get("user_id")?.toString().trim();
    const sku = formData.get("sku")?.toString().trim();
    const quantity = formData.get("quantity")?.toString().trim();

    const customization =
      formData.get("customization")?.toString() || "";

    const colour =
      formData.get("colour")?.toString() || "";

    const diameter =
      formData.get("diameter")?.toString() || "";

    const weight =
      formData.get("weight")?.toString() || "";

    const customer_image = formData.get("customer_image");

    console.log("========== ADD TO CART ==========");
    console.log("user_id:", user_id);
    console.log("sku:", sku);
    console.log("quantity:", quantity);
    console.log("customization:", customization);
    console.log("colour:", colour);
    console.log("diameter:", diameter);
    console.log("weight:", weight);

    if (customer_image instanceof File) {
      console.log("customer_image:", {
        name: customer_image.name,
        type: customer_image.type,
        size: customer_image.size,
      });
    }

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

    if (customization) {
      phpForm.append("customization", customization);
    }

    if (colour) {
      phpForm.append("colour", colour);
    }

    if (diameter) {
      phpForm.append("diameter", diameter);
    }

    if (weight) {
      phpForm.append("weight", weight);
    }

    if (customer_image instanceof File && customer_image.size > 0) {
      phpForm.append(
        "customer_image",
        customer_image,
        customer_image.name
      );
    }

    console.log("Sending request to PHP API...");

    const res = await fetch(
      "http://nextlayer.soon.it/api/Cart/add.php",
      {
        method: "POST",
        body: phpForm,
        cache: "no-store",
      }
    );

    const text = await res.text();

    console.log("========== PHP CART RESPONSE ==========");
    console.log("HTTP STATUS:", res.status);
    console.log("RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "PHP API did not return valid JSON",
          php_status: res.status,
          php_response: text,
        },
        { status: 502 }
      );
    }

    console.log("PHP JSON:", data);

    if (!res.ok || !data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Failed to add item to cart",
          php_response: data,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data?.message || "Product added to cart successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
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
          message: "Cart id is required",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      "http://nextlayer.soon.it/api/Cart/delete.php",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        cache: "no-store",
      }
    );

    const text = await res.text();

    console.log("DELETE CART STATUS:", res.status);
    console.log("DELETE CART RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "PHP API returned invalid JSON",
          php_response: text,
        },
        { status: 502 }
      );
    }

    if (!res.ok || !data?.status) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.message || "Failed to delete cart item",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data?.message || "Cart item deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}