import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json({ error: 'No authentication token provided' }, { status: 401 });
    }
    
    const response = await fetch('http://localhost:3000/api/v1/profiles', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {  
      throw new Error('Failed to fetch profiles');
    }

    const profiles = await response.json();
    return Response.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return Response.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
} 