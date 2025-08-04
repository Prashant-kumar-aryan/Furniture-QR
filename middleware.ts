    import { NextResponse } from 'next/server';
    import type { NextRequest } from 'next/server';

    export function middleware(request: NextRequest) {
      const response = NextResponse.next();

      // Allow requests from any origin
      response.headers.set('Access-Control-Allow-Origin', '*');

      // Optional: Allow specific methods and headers if needed
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return response;
    }

    // Optional: Configure matcher to apply middleware only to specific paths
    export const config = {
      matcher: '/api/:path*', // Apply to all API routes
    };
