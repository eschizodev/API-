import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { config } from  



export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    jwt.verify(token, config.jwtSecret)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}