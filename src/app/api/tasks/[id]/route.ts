import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/middleware'
import { updateTaskSchema } from '@/lib/validations'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const auth = await authenticateRequest(request)
        if (!auth.success || !auth.userId) {
            return createErrorResponse(auth.error || 'Não autorizado', 401)
        }

        const taskId = parseInt(params.id)
        if (isNaN(taskId)) {
            return createErrorResponse('ID da tarefa inválido', 400)
        }

        let body
        try {
        body = await request.json()
        } catch (parseError) {
            return createErrorResponse('Body inválido. Envie um JSON válido.', 400)
        }

        const validationResult = updateTaskSchema.safeParse(body)
        if (!validationResult.success) {
            return createErrorResponse(
                validationResult.error.errors[0].message,
                400
            )
        }

        const [tasks] = await db.execute(
        'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
        [taskId, auth.userId]
        ) as any[]

        if (!tasks || tasks.length === 0) {
            return createErrorResponse('Tarefa não encontrada', 404)
        }

        const updates: string[] = []
        const values: any[] = []

        if (validationResult.data.title !== undefined) {
            updates.push('title = ?')
            values.push(validationResult.data.title)
        }
        if (validationResult.data.description !== undefined) {
            updates.push('description = ?')
            values.push(validationResult.data.description || null)
        }
        if (validationResult.data.status !== undefined) {
            updates.push('status = ?')
            values.push(validationResult.data.status)
        }

        if (updates.length === 0) {
            return createErrorResponse('Nenhum campo para atualizar', 400)
        }

        values.push(taskId, auth.userId)

        await db.execute(
        `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        values
        )

        const [updatedTasks] = await db.execute(
        'SELECT id, user_id, title, description, status, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ?',
        [taskId, auth.userId]
        ) as any[]

        return createSuccessResponse({ task: updatedTasks[0] })
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error)
        return createErrorResponse('Erro interno do servidor', 500)
    }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const auth = await authenticateRequest(request)
        if (!auth.success || !auth.userId) {
            return createErrorResponse(auth.error || 'Não autorizado', 401)
        }

        const taskId = parseInt(params.id)
        if (isNaN(taskId)) {
            return createErrorResponse('ID da tarefa inválido', 400)
        }

        const [tasks] = await db.execute(
        'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
        [taskId, auth.userId]
        ) as any[]

        if (!tasks || tasks.length === 0) {
            return createErrorResponse('Tarefa não encontrada', 404)
        }

        await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [
        taskId,
        auth.userId,
        ])

        return createSuccessResponse({ message: 'Tarefa deletada com sucesso' })
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error)
        return createErrorResponse('Erro interno do servidor', 500)
    }
}

