import { NextRequest, NextResponse } from 'next/server';

// Static allowed origins (add local dev URLs and main production)
const staticAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'https://gajanand-traders-cashback-admin.vercel.app',
];

// Allow dynamic Vercel preview domains like:
// https://gajanand-traders-cashback-admin-xxxxxx.vercel.app
const isAllowedOrigin = (origin: string): boolean => {
  return (
    staticAllowedOrigins.includes(origin) ||
    /^https:\/\/gajanand-traders-cashback-admin-[\w-]+\.vercel\.app$/.test(origin)
  );
};

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isPreflight = request.method === 'OPTIONS';
  const originAllowed = isAllowedOrigin(origin);

  // Handle preflight requests
  if (isPreflight) {
    const headers = {
      ...(originAllowed && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers });
  }

  // Handle actual requests
  const response = NextResponse.next();

  if (originAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*', // Apply middleware to all /api routes
};
