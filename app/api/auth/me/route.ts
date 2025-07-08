import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Call the actual backend API
    const backendResponse = await fetch('http://localhost:3000/api/v1/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || 'Erreur lors de la récupération des données utilisateur' },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    
    // Transform the backend response to match our frontend format
    const transformedUser = {
      id: data.user.Reference,
      email: data.user.E_mail,
      name: data.user.Nom_Prenom,
      role: data.user.Type_Utilisateur,
      profil: data.user.Profil,
      profilLabel: data.user.Profil_Libelle,
      typeUtilisateur: data.user.Type_Utilisateur,
      telephone: data.user.Telephone,
      adresse: data.user.Adresse,
      complementAdresse: data.user.Complement_adresse,
      codePostal: data.user.Code_Postal,
      ville: data.user.Ville,
      gouvernorat: data.user.Gouvernorat,
      pays: data.user.Pays,
      siteDefaut: data.user.Site_Defaut,
      heure: data.user.Heure,
      tempRaffraichissement: data.user.Temp_Raffraichissement,
      couleur: data.user.Couleur,
      image: data.user.Image,
      reinitialisation: data.user.Reinitialisation_mot_de_passe,
      Derniere_connexion: data.user.Derniere_connexion
    }

    return NextResponse.json({
      success: true,
      user: transformedUser
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
} 