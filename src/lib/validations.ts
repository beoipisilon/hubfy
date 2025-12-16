import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
      ),
})

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
})

export const taskSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório').max(255, 'Título muito longo'),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
})

export const updateTaskSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório').max(255, 'Título muito longo').optional(),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
})

