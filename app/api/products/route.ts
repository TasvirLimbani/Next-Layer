// import { NextResponse } from "next/server";

// // ==========================
// // GET: List Products
// // ==========================
// export async function GET() {
//   try {
//     const response = await fetch(
//       "http://nextlayer.soon.it/api/Products/list.php",
//       {
//         method: "GET",
//         cache: "no-store",
//       }
//     );

//     const data = await response.json();

//     return NextResponse.json(data, {
//       status: response.status,
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         status: false,
//         message: "Failed to fetch products",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }



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
    signal: AbortSignal.timeout(15000),
  }
);

if (!response.ok) {
  throw new Error(`API error: ${response.status}`);
}

const data = await response.json();

const fixUrls = (obj: any): any => {
  if (typeof obj === "string") {
    return obj
      .replace("https://nextlayer.soon.it", "http://nextlayer.soon.it")
      .replace("https://localhost", "http://nextlayer.soon.it")
      .replace("http://localhost", "http://nextlayer.soon.it");
  }

  if (Array.isArray(obj)) {
    return obj.map(fixUrls);
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        fixUrls(value),
      ])
    );
  }

  return obj;
};

return NextResponse.json(fixUrls(data), {
  status: 200,
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