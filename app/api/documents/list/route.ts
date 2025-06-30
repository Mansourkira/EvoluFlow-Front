import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    if (!token) return NextResponse.json({ error: 'Token requis' }, { status: 401 });

    const backendResponse = await fetch('http://localhost:3000/api/v1/documents/list', {
      method: 'GET',
      headers: { Authorization: token },
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('Erreur API documents/list:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}