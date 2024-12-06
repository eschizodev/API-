'use client'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { config } from '../../../config'
import { authMiddleware } from '../../../middleware/auth'
import { use } from 'react'

const prisma = new PrismaClient()

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
})

const clienteSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email(),
  senha: z.string().min(8).max(100),
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ error: 'Muitas requisições. Tente novamente mais tarde.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const validatedData = clienteSchema.parse(body)

    const existingCliente = await prisma.cliente.findUnique({
      where: { email: validatedData.email },
    })

    if (existingCliente) {
      return NextResponse.json({ error: 'Email já está em uso' }, { status: 400 })
    }

    const hashedSenha = await crypto.hash(validatedData.senha, 10)

    const novoCliente = await prisma.cliente.create({
      data: {
        nome: validatedData.nome,
        email: validatedData.email,
        senha: hashedSenha,
      },
    })

    const { senha: _, ...clienteSemSenha } = novoCliente

    const token = jwt.sign({ userId: novoCliente.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
    const refreshToken = jwt.sign({ userId: novoCliente.id }, config.jwtSecret, { expiresIn: config.refreshTokenExpiresIn })

    const response = NextResponse.json(clienteSemSenha, { status: 201 })
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    response.cookies.set('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const authResponse = authMiddleware(request)
  if (authResponse.status !== 200) {
    return authResponse
  }

  try {
    const clientes = await prisma.cliente.findMany({
      select: { id: true, nome: true, email: true, createdAt: true, updatedAt: true },
    })
    return NextResponse.json(clientes)
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}