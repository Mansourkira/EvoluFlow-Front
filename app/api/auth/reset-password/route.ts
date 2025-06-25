import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const { newPassword, confirmPassword } = await request.json()

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe sont requis' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    // Call the backend API to reset password
    const backendResponse = await fetch('http://localhost:3000/api/v1/users/reset-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: newPassword,
        confirmPassword: confirmPassword
      })
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || 'Erreur lors de la réinitialisation du mot de passe' },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()

    return NextResponse.json({
      success: true,
      message: data.message || 'Mot de passe réinitialisé avec succès'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
} 