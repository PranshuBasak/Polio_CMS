import {
  parseIpAddress,
  submitContactMessage,
} from '@/features/contact/server/contact-submission-service';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const userAgent = request.headers.get('user-agent');
  const ipAddress = parseIpAddress(request);

  const result = await submitContactMessage({
    rawPayload: body,
    metadata: {
      source: 'terminal',
      userAgent,
      ipAddress,
    },
  });

  if (!result.ok) {
    if (result.type === 'validation') {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          issues: result.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: result.message,
    warning: result.warning,
    emailStatus: result.emailStatus,
  });
}
