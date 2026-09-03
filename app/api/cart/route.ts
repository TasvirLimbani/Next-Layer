import { NextRequest, NextResponse } from "next/server";

const CART_LIST_API =
  "http://nextlayer.soon.it/api/Cart/list.php";

const CART_ADD_API =
  "http://nextlayer.soon.it/api/Cart/add.php";

const CART_DELETE_API =
  "http://nextlayer.soon.it/api/Cart/delete.php";

const PRODUCTS_API =
  "http://nextlayer.soon.it/api/Products/list.php";

const FILAMENT_API =
  "http://nextlayer.soon.it/api/Filament/get.php";

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

    // --------------------------------
    // 1. Get cart
    // --------------------------------
    const cartUrl = `${CART_LIST_API}?user_id=${encodeURIComponent(
      user_id
    )}`;

    const cartResponse = await fetch(cartUrl, {
      method: "GET",
      cache: "no-store",
    });

    const cartText = await cartResponse.text();

    console.log("CART LIST STATUS:", cartResponse.status);
    console.log("CART LIST RESPONSE:", cartText);

    let cartData: any;

    try {
      cartData = JSON.parse(cartText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "PHP API returned invalid JSON",
          php_response: cartText,
        },
        { status: 502 }
      );
    }

    const isSuccessful =
      cartResponse.ok &&
      cartData?.success !== false &&
      cartData?.status !== false;

    if (!isSuccessful) {
      return NextResponse.json(
        {
          success: false,
          message:
            cartData?.message || "Failed to fetch cart list",
          php_response: cartData,
        },
        { status: 400 }
      );
    }

    const cartItems = Array.isArray(cartData?.cart)
      ? cartData.cart
      : [];

    // --------------------------------
    // 2. Get Products + Filaments
    // --------------------------------
    let products: any[] = [];
    let filaments: any[] = [];

    try {
      const [productsResponse, filamentResponse] =
        await Promise.all([
          fetch(PRODUCTS_API, {
            method: "GET",
            cache: "no-store",
          }),

          fetch(FILAMENT_API, {
            method: "GET",
            cache: "no-store",
          }),
        ]);

      // Products
      if (productsResponse.ok) {
        const productsText = await productsResponse.text();

        try {
          const productsData = JSON.parse(productsText);

          if (Array.isArray(productsData?.products)) {
            products = productsData.products;
          }
        } catch (error) {
          console.error(
            "PRODUCTS JSON ERROR:",
            error
          );
        }
      }

      // Filaments
      if (filamentResponse.ok) {
        const filamentText =
          await filamentResponse.text();

        try {
          const filamentData =
            JSON.parse(filamentText);

          if (Array.isArray(filamentData?.data)) {
            filaments = filamentData.data;
          }
        } catch (error) {
          console.error(
            "FILAMENT JSON ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "PRODUCT/FILAMENT FETCH ERROR:",
        error
      );
    }

    console.log(
      "PRODUCT COUNT:",
      products.length
    );

    console.log(
      "FILAMENT COUNT:",
      filaments.length
    );

    // --------------------------------
    // 3. Enrich cart items
    // --------------------------------
    const enrichedCart = cartItems.map(
      (cartItem: any) => {
        const sku = String(
          cartItem?.sku || ""
        ).trim();

        const type = String(
          cartItem?.type || ""
        ).toLowerCase();

        // ==================================================
        // FILAMENT
        // ==================================================
        if (type === "filament") {
          const filament = filaments.find(
            (item: any) =>
              String(item?.sku || "")
                .trim()
                .toLowerCase() ===
              sku.toLowerCase()
          );

          console.log(
            "FILAMENT CART ITEM:",
            sku,
            filament
          );

          const filamentImages =
            Array.isArray(filament?.images)
              ? filament.images
              : [];

          return {
            ...cartItem,

            type: "filament",

            title:
              filament?.title ||
              cartItem?.title ||
              "Filament",

            price: Number(
              filament?.price ??
                cartItem?.price ??
                0
            ),

            images: filamentImages,

            slug:
              filament?.slug ||
              cartItem?.slug ||
              "",

            product: filament
              ? {
                  id: filament.id,
                  name: filament.title,
                  title: filament.title,
                  sku: filament.sku,
                  slug: filament.slug,
                  category:
                    filament.category ||
                    "Filaments",
                  vendor: "NEXTLAYERS",
                  price: Number(
                    filament.price || 0
                  ),
                  image:
                    filamentImages[0] || "",
                  images: filamentImages,
                }
              : null,
          };
        }

        // ==================================================
        // NORMAL PRODUCT
        // ==================================================

        const product = products.find(
          (item: any) =>
            String(item?.sku || "")
              .trim()
              .toLowerCase() ===
            sku.toLowerCase()
        );

        const selectedColour =
          cartItem?.extra?.colour ||
          cartItem?.extra?.color ||
          "";

        let images: string[] = [];

        // Find selected colour variant
        if (
          product &&
          Array.isArray(product.variants)
        ) {
          const variant =
            product.variants.find(
              (item: any) =>
                String(item?.color || "")
                  .trim()
                  .toLowerCase() ===
                String(selectedColour)
                  .trim()
                  .toLowerCase()
            );

          if (
            Array.isArray(
              variant?.image_urls
            )
          ) {
            images = variant.image_urls;
          }
        }

        // If no variant image, use first variant
        if (
          images.length === 0 &&
          product &&
          Array.isArray(product.variants)
        ) {
          const firstVariant =
            product.variants[0];

          if (
            Array.isArray(
              firstVariant?.image_urls
            )
          ) {
            images =
              firstVariant.image_urls;
          }
        }

        // If still no image, use similar images
        if (
          images.length === 0 &&
          product &&
          Array.isArray(product.similar)
        ) {
          images = product.similar
            .map(
              (item: any) =>
                item?.image_url
            )
            .filter(Boolean);
        }

        console.log(
          "NORMAL PRODUCT CART ITEM:",
          sku,
          images
        );

        return {
          ...cartItem,

          type: "product",

          title:
            product?.product_name ||
            cartItem?.title ||
            "Product",

          price: Number(
            product?.price ??
              cartItem?.price ??
              0
          ),

          images,

          product: product
            ? {
                id: product.id,
                name: product.product_name,
                title: product.product_name,
                sku: product.sku,
                category:
                  product.category || "",
                vendor: "EMB MART",
                price: Number(
                  product.price || 0
                ),
                image:
                  images[0] || "",
                images,
              }
            : null,
        };
      }
    );

    // --------------------------------
    // 4. Return enriched cart
    // --------------------------------
    return NextResponse.json({
      success: true,

      grand_total:
        cartData?.grand_total ?? 0,

      total_quantity:
        cartData?.total_quantity ?? 0,

      cart: enrichedCart,
    });
  } catch (error) {
    console.error(
      "GET CART ERROR:",
      error
    );

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
// POST - Add Cart
// ======================
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const user_id = formData
      .get("user_id")
      ?.toString()
      .trim();

    const sku = formData
      .get("sku")
      ?.toString()
      .trim();

    const quantity = formData
      .get("quantity")
      ?.toString()
      .trim();

    const customization =
      formData.get("customization")?.toString() ||
      "";

    const colour =
      formData.get("colour")?.toString() ||
      "";

    const diameter =
      formData.get("diameter")?.toString() ||
      "";

    const weight =
      formData.get("weight")?.toString() ||
      "";

    const customer_image =
      formData.get("customer_image");

    console.log(
      "========== ADD TO CART =========="
    );

    console.log("user_id:", user_id);
    console.log("sku:", sku);
    console.log("quantity:", quantity);
    console.log("customization:", customization);
    console.log("colour:", colour);
    console.log("diameter:", diameter);
    console.log("weight:", weight);

    if (customer_image instanceof File) {
      console.log(
        "customer_image:",
        {
          name: customer_image.name,
          type: customer_image.type,
          size: customer_image.size,
        }
      );
    }

    if (
      !user_id ||
      !sku ||
      !quantity
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "user_id, sku and quantity are required",
        },
        { status: 400 }
      );
    }

    const phpForm = new FormData();

    phpForm.append(
      "user_id",
      user_id
    );

    phpForm.append(
      "sku",
      sku
    );

    phpForm.append(
      "quantity",
      quantity
    );

    if (customization) {
      phpForm.append(
        "customization",
        customization
      );
    }

    if (colour) {
      phpForm.append(
        "colour",
        colour
      );
    }

    if (diameter) {
      phpForm.append(
        "diameter",
        diameter
      );
    }

    if (weight) {
      phpForm.append(
        "weight",
        weight
      );
    }

    if (
      customer_image instanceof File &&
      customer_image.size > 0
    ) {
      phpForm.append(
        "customer_image",
        customer_image,
        customer_image.name
      );
    }

    console.log(
      "Sending request to PHP API..."
    );

    const res = await fetch(
      CART_ADD_API,
      {
        method: "POST",
        body: phpForm,
        cache: "no-store",
      }
    );

    const text = await res.text();

    console.log(
      "========== PHP CART RESPONSE =========="
    );

    console.log(
      "HTTP STATUS:",
      res.status
    );

    console.log(
      "RESPONSE:",
      text
    );

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "PHP API did not return valid JSON",
          php_status: res.status,
          php_response: text,
        },
        { status: 502 }
      );
    }

    console.log(
      "PHP JSON:",
      data
    );

    if (
      !res.ok ||
      !data?.status
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.message ||
            "Failed to add item to cart",
          php_response: data,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          data?.message ||
          "Product added to cart successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADD TO CART ERROR:",
      error
    );

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
export async function DELETE(
  req: NextRequest
) {
  try {
    const body =
      await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cart id is required",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      CART_DELETE_API,
      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          id,
        }),

        cache: "no-store",
      }
    );

    const text =
      await res.text();

    console.log(
      "DELETE CART STATUS:",
      res.status
    );

    console.log(
      "DELETE CART RESPONSE:",
      text
    );

    let data: any;

    try {
      data =
        JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "PHP API returned invalid JSON",
          php_response: text,
        },
        { status: 502 }
      );
    }

    if (
      !res.ok ||
      !data?.status
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.message ||
            "Failed to delete cart item",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          data?.message ||
          "Cart item deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE CART ERROR:",
      error
    );

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