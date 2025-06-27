import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'autorisation manquant' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Forward the request to the backend API
    const backendResponse = await fetch('http://localhost:3000/api/v1/filiere/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la suppression de la filière' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Erreur API filiere/delete:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 