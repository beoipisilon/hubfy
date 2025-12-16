export interface User {
    id: number
    name: string
    email: string
    created_at: Date
}

export interface Task {
    id: number
    user_id: number
    title: string
    description: string | null
    status: 'pending' | 'in_progress' | 'completed'
    created_at: Date
    updated_at: Date
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface TaskRequest {
    title: string
    description?: string
    status?: 'pending' | 'in_progress' | 'completed'
}

export interface AuthResponse {
    token: string
    user: Omit<User, 'created_at'>
}

export interface RegisterResponse {
    message: string
    user: Omit<User, 'created_at'>
}

