import { NextRequest, NextResponse } from 'next/server';

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// This allows any origin — for development or unrestricted access
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  const isPreflight = request.method === 'OPTIONS';

  // ✅ Handle preflight (OPTIONS) request
  if (isPreflight) {
    const headers = {
      'Access-Control-Allow-Origin': origin,
      ...corsOptions,
    };
    return NextResponse.json({}, { headers });
  }

  // ✅ Set CORS headers for actual requests
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', origin);

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
