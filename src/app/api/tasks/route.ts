import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/middleware'
import { taskSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request)
        if (!auth.success || !auth.userId) {
        return createErrorResponse(auth.error || 'Não autorizado', 401)
        }

        const [tasks] = await db.execute(
        'SELECT id, user_id, title, description, status, created_at, updated_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
        [auth.userId]
        ) as any[]

        return createSuccessResponse({ tasks: tasks || [] })
    } catch (error) {
        console.error('Erro ao listar tarefas:', error)
        return createErrorResponse('Erro interno do servidor', 500)
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request)
        if (!auth.success || !auth.userId) {
            return createErrorResponse(auth.error || 'Não autorizado', 401)
        }

        let body
        try {
            body = await request.json()
        } catch (parseError) {
            return createErrorResponse('Body inválido. Envie um JSON válido.', 400)
        }

        const validationResult = taskSchema.safeParse(body)
        if (!validationResult.success) {
            return createErrorResponse(
                validationResult.error.errors[0].message,
                400
            )
        }

        const { title, description, status } = validationResult.data

        const [result] = await db.execute(
        'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
        [auth.userId, title, description || null, status || 'pending']
        ) as any

        const [newTask] = await db.execute(
        'SELECT id, user_id, title, description, status, created_at, updated_at FROM tasks WHERE id = ?',
        [result.insertId]
        ) as any[]

        return createSuccessResponse(
            { task: newTask[0] },
            201
        )
    } catch (error) {
        console.error('Erro ao criar tarefa:', error)
        return createErrorResponse('Erro interno do servidor', 500)
    }
}

