import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { comparePassword, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { createErrorResponse, createSuccessResponse } from '@/lib/middleware'

export async function POST(request: NextRequest) {
    try {
        let body
        try {
            body = await request.json()
        } catch (parseError) {
            return createErrorResponse('Body inválido. Envie um JSON válido.', 400)
        }

        const validationResult = loginSchema.safeParse(body)
        if (!validationResult.success) {
          return createErrorResponse(
            validationResult.error.errors[0].message,
            400
          )
        }

        const { email, password } = validationResult.data

        const [users] = await db.execute(
          'SELECT id, name, email, password FROM users WHERE email = ?',
          [email]
        ) as any[]

        if (!users || users.length === 0) {
          return createErrorResponse('Email ou senha inválidos', 401)
        }

        const user = users[0]

        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
          return createErrorResponse('Email ou senha inválidos', 401)
        }

        const token = generateToken({
          id: user.id,
          name: user.name,
          email: user.email,
        })

        return createSuccessResponse({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        })
    } catch (error) {
        console.error('Erro no login:', error)
        return createErrorResponse('Erro interno do servidor', 500)
    }
}

