import { NextRequest, NextResponse } from 'next/server';
import { extractAccessToken, resolveApiUrl } from '@/app/api/_helpers';

export async function POST(request: NextRequest) {
  const accessToken = extractAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(resolveApiUrl('/api/admin/domains/sync'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to sync domains' },
      { status: 500 }
    );
  }
}
