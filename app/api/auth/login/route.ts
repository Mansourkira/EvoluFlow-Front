import { NextRequest, NextResponse } from 'next/server'

// Mock user data - this would come from your backend database
const mockUsers = [
  {
    id: 1,
    email: 'admin@admission.com',
    password: 'admin123',
    name: 'Administrateur Principal',
    role: 'admin'
  },
  {
    id: 2,
    email: 'consultant@admission.com',
    password: 'consultant123',
    name: 'Marie Consultant',
    role: 'consultant'
  },
  {
    id: 3,
    email: 'candidat@admission.com',
    password: 'candidat123',
    name: 'Jean Candidat',
    role: 'candidat'
  },
  {
    id: 4,
    email: 'professeur@admission.com',
    password: 'prof123',
    name: 'Dr. Sophie Professeur',
    role: 'professeur'
  },
  {
    id: 5,
    email: 'direction@admission.com',
    password: 'direction123',
    name: 'Paul Direction',
    role: 'direction'
  },
  {
    id: 6,
    email: 'financier@admission.com',
    password: 'finance123',
    name: 'Claire Financier',
    role: 'financier'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const user = mockUsers.find(u => u.email === email)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 401 }
      )
    }

    // Check password (in real app, you'd hash and compare)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Generate mock token (in real app, use JWT)
    const token = `mock-jwt-token-${user.id}-${Date.now()}`

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for login.' },
    { status: 405 }
  )
} 