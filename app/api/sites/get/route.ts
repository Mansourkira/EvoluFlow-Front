
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    
    // Get the token from cookies or headers
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json({ error: 'No authentication token provided' }, { status: 401 });
    }

    const response = await fetch('http://localhost:3000/api/v1/sites', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(errorData, { status: response.status });
    }
    console.log("sites", response);

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Error getting sites:', error);
    return Response.json({ error: 'Failed to get sites' }, { status: 500 });
  }
} 