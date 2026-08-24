// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     const res = await fetch(
//       'http://nextlayer.soon.it/api/Products/latest.php',
//       {
//         method: 'GET',
//         cache: 'no-store',
//       }
//     );

//     const data = await res.json();

//     if (!data?.status) {
//       return NextResponse.json(
//         {
//           status: false,
//           message: 'Failed to fetch latest products',
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         status: false,
//         message: 'Internal Server Error',
//         error: error instanceof Error ? error.message : error,
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'http://nextlayer.soon.it/api/Products/latest.php',
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    const data = await res.json();

    if (!data?.status) {
      return NextResponse.json(
        {
          status: false,
          message: 'Failed to fetch latest products',
        },
        { status: 400 }
      );
    }

    const fixUrls = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj
          .replace('http://localhost', 'https://nextlayer.soon.it')
          .replace('https://localhost', 'https://nextlayer.soon.it');
      }

      if (Array.isArray(obj)) {
        return obj.map(fixUrls);
      }

      if (obj && typeof obj === 'object') {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            key,
            fixUrls(value),
          ])
        );
      }

      return obj;
    };

    const fixedData = fixUrls(data);

    return NextResponse.json(fixedData, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}