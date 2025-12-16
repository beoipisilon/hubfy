import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export interface AuthenticatedRequest extends NextRequest {
    userId?: number
    userEmail?: string
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ success: boolean; userId?: number; userEmail?: string; error?: string }> {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Token de autenticação não fornecido',
      }
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return {
        success: false,
        error: 'Token inválido ou expirado',
      }
    }

    return {
      success: true,
      userId: decoded.id,
      userEmail: decoded.email,
    }
}

export function createErrorResponse(
    message: string,
    status: number = 400
): NextResponse {
    return NextResponse.json({ error: message }, { status })
}

export function createSuccessResponse<T>(
    data: T,
    status: number = 200
): NextResponse {
    return NextResponse.json(data, { status })
}

