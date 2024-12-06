import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { config } from '../../config'
const decoded = jwt.verify(refreshToken, config.jwtSecret) as { userId: string }
const newToken = jwt.sign({ userId: decoded.userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn })

export async function POST(request: Request) {
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (!refreshToken) {
    return NextResponse.json({ error: 'Refresh token não fornecido' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwtSecret) as { userId: string }
    const newToken = jwt.sign({ userId: decoded.userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn })

    const response = NextResponse.json({ message: 'Token atualizado com sucesso' })
    response.cookies.set('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Refresh token inválido' }, { status: 401 })
  }
}