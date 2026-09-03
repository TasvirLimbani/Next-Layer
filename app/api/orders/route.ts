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
      `http://nextlayer.soon.it/api/Orders/history.php?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const text = await res.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          status: false,
          message: "Order history API returned invalid JSON",
          php_status: res.status,
          php_response: text,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("GET Order History Error:", error);

    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch order history",
      },
      { status: 500 }
    );
  }
}

// ======================================
// POST: Add Order
// ======================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      user_id,
      payment_id,
      order_status,
      tracking_id,

      shipping_address,

      shipping_name,
      shipping_phone,
      shipping_address_text,
      shipping_city,
      shipping_state,
      shipping_pincode,

      name,
      phone,
      address,
      city,
      state,
      pincode,

      items,
    } = body;

    // ======================================
    // SHIPPING ADDRESS
    // ======================================

    let resolvedName = "";
    let resolvedPhone = "";
    let resolvedAddress = "";
    let resolvedCity = "";
    let resolvedState = "";
    let resolvedPincode = "";

    if (
      shipping_address &&
      typeof shipping_address === "object" &&
      !Array.isArray(shipping_address)
    ) {
      resolvedName =
        String(shipping_address.name ?? "").trim() ||
        String(shipping_name ?? "").trim() ||
        String(name ?? "").trim();

      resolvedPhone =
        String(shipping_address.phone ?? "").trim() ||
        String(shipping_phone ?? "").trim() ||
        String(phone ?? "").trim();

      resolvedAddress =
        String(shipping_address.address ?? "").trim() ||
        String(shipping_address_text ?? "").trim() ||
        String(address ?? "").trim();

      resolvedCity =
        String(shipping_address.city ?? "").trim() ||
        String(shipping_city ?? "").trim() ||
        String(city ?? "").trim();

      resolvedState =
        String(shipping_address.state ?? "").trim() ||
        String(shipping_state ?? "").trim() ||
        String(state ?? "").trim();

      resolvedPincode =
        String(shipping_address.pincode ?? "").trim() ||
        String(shipping_pincode ?? "").trim() ||
        String(pincode ?? "").trim();
    } else {
      resolvedName =
        String(shipping_name ?? "").trim() ||
        String(name ?? "").trim();

      resolvedPhone =
        String(shipping_phone ?? "").trim() ||
        String(phone ?? "").trim();

      resolvedAddress =
        String(shipping_address_text ?? "").trim() ||
        String(address ?? "").trim();

      resolvedCity =
        String(shipping_city ?? "").trim() ||
        String(city ?? "").trim();

      resolvedState =
        String(shipping_state ?? "").trim() ||
        String(state ?? "").trim();

      resolvedPincode =
        String(shipping_pincode ?? "").trim() ||
        String(pincode ?? "").trim();
    }

    // ======================================
    // VALIDATE USER
    // ======================================

    const userIdNumber = Number(user_id);

    if (!Number.isInteger(userIdNumber) || userIdNumber <= 0) {
      return NextResponse.json(
        {
          status: false,
          message: "Valid user_id is required",
        },
        { status: 400 }
      );
    }

    // ======================================
    // VALIDATE SHIPPING
    // ======================================

    if (!resolvedName) {
      return NextResponse.json(
        {
          status: false,
          message: "Shipping name is required",
        },
        { status: 400 }
      );
    }

    if (!resolvedPhone) {
      return NextResponse.json(
        {
          status: false,
          message: "Shipping phone is required",
        },
        { status: 400 }
      );
    }

    if (!resolvedAddress) {
      return NextResponse.json(
        {
          status: false,
          message: "Shipping address is required",
        },
        { status: 400 }
      );
    }

    if (!resolvedCity) {
      return NextResponse.json(
        {
          status: false,
          message: "Shipping city is required",
        },
        { status: 400 }
      );
    }

    if (!resolvedState) {
      return NextResponse.json(
        {
          status: false,
          message: "Shipping state is required",
        },
        { status: 400 }
      );
    }

    if (!resolvedPincode) {
      return NextResponse.json(
        {
          status: false,
          message: "Shipping pincode is required",
        },
        { status: 400 }
      );
    }

    // ======================================
    // VALIDATE ITEMS
    // ======================================

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "Order items are required",
        },
        { status: 400 }
      );
    }

    // ======================================
    // CLEAN ITEMS
    // ======================================

    const cleanItems = items.map((item: any, index: number) => {
      const productId = Number(
        item?.product_id ??
        item?.productId ??
        item?.product?.id ??
        item?.id ??
        0
      );

      const sku = String(
        item?.sku ??
        item?.SKU ??
        item?.product?.sku ??
        item?.product?.SKU ??
        ""
      ).trim();

      const quantity = Number(
        item?.quantity ?? 0
      );

      const price = Number(
        item?.price ??
        item?.product?.price ??
        0
      );

      // ======================================
      // PRODUCT ID
      // ======================================

      if (!Number.isInteger(productId) || productId <= 0) {
        throw new Error(
          `Product ID is missing for order item ${index + 1}`
        );
      }

      // ======================================
      // SKU
      // ======================================

      if (!sku) {
        throw new Error(
          `SKU is missing for order item ${index + 1}`
        );
      }

      // ======================================
      // QUANTITY
      // ======================================

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        throw new Error(
          `Invalid quantity for order item ${index + 1}`
        );
      }

      // ======================================
      // PRICE
      // ======================================

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        throw new Error(
          `Invalid price for order item ${index + 1}`
        );
      }

      /*
       * IMPORTANT:
       *
       * We DO NOT require product_name here.
       *
       * PHP will get product_name from the
       * products table using SKU.
       */

      return {
        product_id: productId,
        sku,
        quantity,
        price,

        customization:
          item?.customization ??
          item?.extra?.customization ??
          "",

        customer_image:
          item?.customer_image ??
          item?.extra?.customer_image ??
          "",
      };
    });

    // ======================================
    // CALCULATE TOTAL
    // ======================================

    const calculatedTotal = cleanItems.reduce(
      (sum: number, item: any) => {
        return sum + item.price * item.quantity;
      },
      0
    );

    // ======================================
    // FINAL PHP PAYLOAD
    // ======================================

    const payload = {
      user_id: userIdNumber,

      payment_id:
        String(payment_id ?? "").trim() ||
        `PAY-${Date.now()}`,

      total_amount: Number(
        calculatedTotal.toFixed(2)
      ),

      order_status:
        order_status || "Pending",

      tracking_id:
        tracking_id ?? null,

      shipping_address: {
        name: resolvedName,
        phone: resolvedPhone,
        address: resolvedAddress,
        city: resolvedCity,
        state: resolvedState,
        pincode: resolvedPincode,
      },

      items: cleanItems,
    };

    console.log(
      "FINAL ORDER PAYLOAD:",
      JSON.stringify(payload, null, 2)
    );

    // ======================================
    // CALL PHP
    // ======================================

    const res = await fetch(
      "http://nextlayer.soon.it/api/Orders/add.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(payload),

        cache: "no-store",
      }
    );

    const text = await res.text();

    console.log(
      "PHP ORDER STATUS:",
      res.status
    );

    console.log(
      "PHP ORDER RESPONSE:",
      text
    );

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          status: false,
          message:
            "PHP order API returned invalid JSON",

          php_status: res.status,

          php_response: text,
        },
        { status: 502 }
      );
    }

    // ======================================
    // PHP ERROR
    // ======================================

    if (!res.ok || data?.status === false) {
      return NextResponse.json(
        {
          status: false,

          message:
            data?.message ||
            "Failed to place order",

          php_response: data,
        },
        { status: 400 }
      );
    }

    // ======================================
    // SUCCESS
    // ======================================

    return NextResponse.json(
      {
        status: true,

        message:
          data?.message ||
          "Order placed successfully",

        order_id:
          data?.order_id ?? null,

        payment_id:
          data?.payment_id ??
          payload.payment_id,

        total_amount:
          data?.total_amount ??
          calculatedTotal,

        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "POST Order Error:",
      error
    );

    return NextResponse.json(
      {
        status: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to place order",
      },
      { status: 500 }
    );
  }
}