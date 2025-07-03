import { NextRequest, NextResponse } from 'next/server';
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    if (!token) return NextResponse.json({ error: 'Token requis' }, { status: 401 });

    const body = await request.json();
    const backendResponse = await fetch('http://localhost:3000/api/v1/documents/delete', {
      method: 'DELETE',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('Erreur API documents/delete:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}