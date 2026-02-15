import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(5000),
});

const parseIpAddress = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (!forwardedFor) {
    return null;
  }

  const [firstIp] = forwardedFor.split(',').map((segment) => segment.trim());
  return firstIp || null;
};

export async function POST(request: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'SUPABASE_SERVICE_ROLE_KEY is missing. Configure it in .env.local.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const payload = contactSubmissionSchema.parse(body);
    const userAgent = request.headers.get('user-agent');
    const ipAddress = parseIpAddress(request);

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from('contact_submissions').insert({
      name: payload.name,
      email: payload.email,
      message: payload.message,
      subject: 'Terminal Contact',
      status: 'new',
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Terminal contact insert failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save contact message.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact message saved successfully.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed.',
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Terminal contact route failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error while sending contact message.',
      },
      { status: 500 }
    );
  }
}

