import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = [
  'http://127.0.0.1:5500/furniture.html',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://localhost:3002',
  process.env.NEXT_PUBLIC_CLIENT_USER_URL,
  process.env.NEXT_PUBLIC_CLIENT_ADMIN_URL
];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
  console.log('CORS middleware triggered for:', request.nextUrl.pathname);

  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const isPreflight = request.method === 'OPTIONS';

  // ✅ Handle preflight (OPTIONS) request
  if (isPreflight) {
    const headers = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers });
  }

  // ✅ For regular requests, set CORS headers
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
