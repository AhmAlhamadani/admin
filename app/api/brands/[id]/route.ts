import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://atlasplast-backend-nzgbks-ac6dbf-147-93-120-252.traefik.me';

async function proxyRequest(request: NextRequest, path: string) {
  try {
    const url = new URL(request.url);
    const queryString = url.searchParams.toString();
    const apiUrl = `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;
    
    const headers: Record<string, string> = {};
    
    // Copy relevant headers
    if (request.headers.get('content-type')) {
      headers['Content-Type'] = request.headers.get('content-type')!;
    }
    
    const requestBody = request.method !== 'GET' ? await request.text() : undefined;
    
    const response = await fetch(apiUrl, {
      method: request.method,
      headers,
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyRequest(request, `/api/brands/${params.id}`);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyRequest(request, `/api/brands/${params.id}`);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyRequest(request, `/api/brands/${params.id}`);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyRequest(request, `/api/brands/${params.id}`);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
