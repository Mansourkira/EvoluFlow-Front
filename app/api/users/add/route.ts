import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the token from cookies or headers
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json({ error: 'No authentication token provided' }, { status: 401 });
    }

    const response = await fetch('http://localhost:3000/api/v1/users/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Error adding user:', error);
    return Response.json({ error: 'Failed to add user' }, { status: 500 });
  }
} 