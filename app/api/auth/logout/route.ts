import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Invalidate the JWT token
    // 2. Clear server-side session
    // 3. Clear cookies
    // 4. Log the logout event

    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Méthode non autorisée' },
    { status: 405 }
  )
} 