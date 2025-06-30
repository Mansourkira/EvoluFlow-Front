import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'autorisation manquant' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.Reference) {
      return NextResponse.json(
        { error: 'La référence est requise dans le body' },
        { status: 400 }
      );
    }

    const backendResponse = await fetch('http://localhost:3000/api/v1/documents/getByReference', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Reference: body.Reference }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la récupération du document' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Erreur API documents/getByReference :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
