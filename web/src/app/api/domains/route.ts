import { NextResponse } from 'next/server';
import { resolveApiUrl } from '@/app/api/_helpers';

export async function GET() {
  try {
    const response = await fetch(resolveApiUrl('/api/domains/'), {
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}
