import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/app/config'; // Ou o caminho correto para o seu arquivo de configuração

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const corsOrigin = config.corsOrigin;
  response.headers.set('Access-Control-Allow-Origin', corsOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}
