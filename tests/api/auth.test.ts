import { POST as registerPOST } from '@/app/api/auth/register/route'
import { POST as loginPOST } from '@/app/api/auth/login/route'
import db from '@/lib/db'
import { hashPassword } from '@/lib/auth'

jest.mock('@/lib/db', () => ({
    __esModule: true,
    default: {
        execute: jest.fn(),
    },
}))

describe('Auth API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('POST /api/auth/register', () => {
        it('deve registrar um novo usuário com sucesso', async () => {
        const mockExecute = db.execute as jest.Mock

        mockExecute.mockResolvedValueOnce([[]])
        mockExecute.mockResolvedValueOnce([
            {
            insertId: 1,
            },
        ])

        const request = new Request('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            name: 'Teste User',
            email: 'teste@teste.com',
            password: 'Senha123',
            }),
        })

        const response = await registerPOST(request as any)
        const data = await response.json()

        expect(response.status).toBe(201)
        expect(data.user).toHaveProperty('id')
        expect(data.user.email).toBe('teste@teste.com')
        expect(data.user.name).toBe('Teste User')
        expect(data.message).toBe('Usuário criado com sucesso')
        })

        it('deve retornar erro se email já existe', async () => {
        const mockExecute = db.execute as jest.Mock

        mockExecute.mockResolvedValueOnce([[{ id: 1 }]])

        const request = new Request('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            name: 'Teste User',
            email: 'teste@teste.com',
            password: 'Senha123',
            }),
        })

        const response = await registerPOST(request as any)
        const data = await response.json()

        expect(response.status).toBe(409)
        expect(data.error).toBe('Email já cadastrado')
        })

        it('deve retornar erro se validação falhar', async () => {
        const request = new Request('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            name: 'T',
            email: 'email-invalido',
            password: '123',
            }),
        })

        const response = await registerPOST(request as any)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBeDefined()
        })
    })

    describe('POST /api/auth/login', () => {
        it('deve fazer login com sucesso', async () => {
        const mockExecute = db.execute as jest.Mock
        const hashedPassword = await hashPassword('Senha123')

        mockExecute.mockResolvedValueOnce([
            [
            {
                id: 1,
                name: 'Teste User',
                email: 'teste@teste.com',
                password: hashedPassword,
            },
            ],
        ])

        const request = new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            email: 'teste@teste.com',
            password: 'Senha123',
            }),
        })

        const response = await loginPOST(request as any)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.token).toBeDefined()
        expect(data.user.email).toBe('teste@teste.com')
        })

        it('deve retornar erro se credenciais inválidas', async () => {
        const mockExecute = db.execute as jest.Mock

        mockExecute.mockResolvedValueOnce([[]])

        const request = new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            email: 'teste@teste.com',
            password: 'SenhaErrada',
            }),
        })

        const response = await loginPOST(request as any)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('Email ou senha inválidos')
        })

        it('deve retornar erro se senha incorreta', async () => {
        const mockExecute = db.execute as jest.Mock
        const hashedPassword = await hashPassword('Senha123')

        mockExecute.mockResolvedValueOnce([
            [
            {
                id: 1,
                name: 'Teste User',
                email: 'teste@teste.com',
                password: hashedPassword,
            },
            ],
        ])

        const request = new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            email: 'teste@teste.com',
            password: 'SenhaErrada',
            }),
        })

        const response = await loginPOST(request as any)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('Email ou senha inválidos')
        })
    })
})

