import { GET, POST } from '@/app/api/tasks/route'
import { PUT, DELETE } from '@/app/api/tasks/[id]/route'
import db from '@/lib/db'
import { generateToken } from '@/lib/auth'

jest.mock('@/lib/db', () => ({
    __esModule: true,
    default: {
        execute: jest.fn(),
    },
}))

describe('Tasks API', () => {
    const mockUserId = 1
    const mockToken = generateToken({
        id: mockUserId,
        name: 'Test User',
        email: 'test@test.com',
    })

    const createAuthenticatedRequest = (
        url: string,
        method: string = 'GET',
        body?: any
    ) => {
        return new Request(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        }) as any
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/tasks', () => {
        it('deve listar tarefas do usuário autenticado', async () => {
        const mockExecute = db.execute as jest.Mock
        const mockTasks = [
            {
            id: 1,
            user_id: mockUserId,
            title: 'Tarefa 1',
            description: 'Descrição 1',
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date(),
            },
            {
            id: 2,
            user_id: mockUserId,
            title: 'Tarefa 2',
            description: 'Descrição 2',
            status: 'completed',
            created_at: new Date(),
            updated_at: new Date(),
            },
        ]

        mockExecute.mockResolvedValueOnce([mockTasks])

        const request = createAuthenticatedRequest('http://localhost:3000/api/tasks')

        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.tasks).toHaveLength(2)
        expect(data.tasks[0].title).toBe('Tarefa 1')
        })

        it('deve retornar erro se não autenticado', async () => {
        const request = new Request('http://localhost:3000/api/tasks', {
            method: 'GET',
        }) as any

        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBeDefined()
        })
    })

    describe('POST /api/tasks', () => {
        it('deve criar uma nova tarefa', async () => {
        const mockExecute = db.execute as jest.Mock

        mockExecute.mockResolvedValueOnce([{ insertId: 1 }])
        mockExecute.mockResolvedValueOnce([
            [
            {
                id: 1,
                user_id: mockUserId,
                title: 'Nova Tarefa',
                description: 'Descrição',
                status: 'pending',
                created_at: new Date(),
                updated_at: new Date(),
            },
            ],
        ])

        const request = createAuthenticatedRequest(
            'http://localhost:3000/api/tasks',
            'POST',
            {
            title: 'Nova Tarefa',
            description: 'Descrição',
            status: 'pending',
            }
        )

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(201)
        expect(data.task.title).toBe('Nova Tarefa')
        expect(data.task.user_id).toBe(mockUserId)
        })

        it('deve retornar erro se validação falhar', async () => {
        const request = createAuthenticatedRequest(
            'http://localhost:3000/api/tasks',
            'POST',
            {
            title: '',
            }
        )

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBeDefined()
        })
    })

    describe('PUT /api/tasks/[id]', () => {
        it('deve atualizar uma tarefa existente', async () => {
        const mockExecute = db.execute as jest.Mock
        const taskId = 1

        // Mock: verificar se tarefa existe e pertence ao usuário
        mockExecute.mockResolvedValueOnce([[{ id: taskId }]])
        // Mock: atualizar tarefa
        mockExecute.mockResolvedValueOnce([[]])
        // Mock: buscar tarefa atualizada
        mockExecute.mockResolvedValueOnce([
            [
            {
                id: taskId,
                user_id: mockUserId,
                title: 'Tarefa Atualizada',
                description: 'Nova descrição',
                status: 'in_progress',
                created_at: new Date(),
                updated_at: new Date(),
            },
            ],
        ])

        const request = createAuthenticatedRequest(
            `http://localhost:3000/api/tasks/${taskId}`,
            'PUT',
            {
            title: 'Tarefa Atualizada',
            status: 'in_progress',
            }
        )

        const response = await PUT(request, { params: { id: taskId.toString() } })
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.task.title).toBe('Tarefa Atualizada')
        expect(data.task.status).toBe('in_progress')
        })

        it('deve retornar erro se tarefa não encontrada', async () => {
        const mockExecute = db.execute as jest.Mock

        // Mock: tarefa não encontrada
        mockExecute.mockResolvedValueOnce([[]])

        const request = createAuthenticatedRequest(
            'http://localhost:3000/api/tasks/999',
            'PUT',
            {
            title: 'Tarefa',
            }
        )

        const response = await PUT(request, { params: { id: '999' } })
        const data = await response.json()

        expect(response.status).toBe(404)
        expect(data.error).toBe('Tarefa não encontrada')
        })
    })

    describe('DELETE /api/tasks/[id]', () => {
        it('deve deletar uma tarefa existente', async () => {
        const mockExecute = db.execute as jest.Mock
        const taskId = 1

        // Mock: verificar se tarefa existe
        mockExecute.mockResolvedValueOnce([[{ id: taskId }]])
        // Mock: deletar tarefa
        mockExecute.mockResolvedValueOnce([[]])

        const request = createAuthenticatedRequest(
            `http://localhost:3000/api/tasks/${taskId}`,
            'DELETE'
        )

        const response = await DELETE(request, { params: { id: taskId.toString() } })
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.message).toBe('Tarefa deletada com sucesso')
        })

        it('deve retornar erro se tarefa não encontrada', async () => {
        const mockExecute = db.execute as jest.Mock

        mockExecute.mockResolvedValueOnce([[]])

        const request = createAuthenticatedRequest(
            'http://localhost:3000/api/tasks/999',
            'DELETE'
        )

        const response = await DELETE(request, { params: { id: '999' } })
        const data = await response.json()

        expect(response.status).toBe(404)
        expect(data.error).toBe('Tarefa não encontrada')
        })
    })
})

