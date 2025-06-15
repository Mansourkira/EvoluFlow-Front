import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Extract JWT token from Authorization header or cookies
    // 2. Verify the token
    // 3. Get user data from database
    
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Mock token validation (in real app, verify JWT)
    if (!token.startsWith('mock-jwt-token-')) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Extract user ID from mock token
    const userId = token.replace('mock-jwt-token-', '')
    
    // Mock user data (in real app, fetch from database)
    const mockUsers = {
      '1': { id: 1, email: 'admin@allmeng.com', role: 'admin', name: 'Administrateur' },
      '2': { id: 2, email: 'candidat@allmeng.com', role: 'candidat', name: 'Jean Dupont' },
      '3': { id: 3, email: 'professeur@allmeng.com', role: 'professeur', name: 'Marie Martin' }
    }

    const user = mockUsers[userId as keyof typeof mockUsers]
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
} 