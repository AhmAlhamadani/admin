import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://atlasplast-backend-nzgbks-ac6dbf-147-93-120-252.traefik.me';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const apiUrl = `${API_BASE_URL}/api/upload-multiple`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Upload Multiple API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload multiple files', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
