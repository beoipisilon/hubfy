import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { createErrorResponse, createSuccessResponse } from '@/lib/middleware'

export async function POST(request: NextRequest) {
    try {
        let body
        try {
            body = await request.json()
        } catch (parseError) {
            return createErrorResponse('Body inválido. Envie um JSON válido.', 400)
        }
        
        const validationResult = registerSchema.safeParse(body)
        if (!validationResult.success) {
          return createErrorResponse(
            validationResult.error.errors[0].message,
            400
          )
        }

        const { name, email, password } = validationResult.data

        const [existingUsers] = await db.execute(
          'SELECT id FROM users WHERE email = ?',
          [email]
        )

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
          return createErrorResponse('Email já cadastrado', 409)
        }

        const hashedPassword = await hashPassword(password)

        const [result] = await db.execute(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword]
        ) as any

        return createSuccessResponse(
          {
            message: 'Usuário criado com sucesso',
            user: {
              id: result.insertId,
              name,
              email,
            },
          },
          201
        )
    } catch (error) {
        console.error('Erro no registro:', error)
        return createErrorResponse('Erro interno do servidor', 500)
    }
}

