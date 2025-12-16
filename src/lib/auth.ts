import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '@/types'

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: Omit<User, 'created_at'>): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    )
}

export function verifyToken(token: string): { id: number; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
      return decoded
    } catch (error) {
      return null
    }
}

