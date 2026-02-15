import { createAdminClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/logger/server-logger';
import nodemailer from 'nodemailer';
import { z } from 'zod';

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(5000),
});

export type ContactSubmissionPayload = z.infer<typeof contactSubmissionSchema>;
export type ContactSubmissionSource = 'website' | 'terminal';

type ContactSubmissionSuccess = {
  ok: true;
  message: string;
  warning?: string;
  emailStatus: 'sent' | 'partial';
};

type ContactSubmissionFailure = {
  ok: false;
  type: 'validation' | 'config' | 'database' | 'unexpected';
  error: string;
  issues?: z.ZodIssue[];
};

export type ContactSubmissionResult =
  | ContactSubmissionSuccess
  | ContactSubmissionFailure;

type ContactSubmissionMetadata = {
  source: ContactSubmissionSource;
  userAgent?: string | null;
  ipAddress?: string | null;
};

const contactConfigSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().trim().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().trim().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1),
  CONTACT_SMTP_USER: z.string().trim().email(),
  CONTACT_SMTP_PASS: z.string().trim().min(1),
  CONTACT_NOTIFICATION_EMAIL: z.string().trim().email(),
  CONTACT_AUTOREPLY_FROM_NAME: z.string().trim().min(1).max(120),
});

type ContactConfig = z.infer<typeof contactConfigSchema>;

const getContactConfig = (): { ok: true; config: ContactConfig } | { ok: false; missingKeys: string[] } => {
  const parsed = contactConfigSchema.safeParse(process.env);
  if (parsed.success) {
    return { ok: true, config: parsed.data };
  }

  const missingKeys = Array.from(
    new Set(
      parsed.error.issues.map((issue) =>
        issue.path.length > 0 ? String(issue.path[0]) : 'UNKNOWN'
      )
    )
  );

  return { ok: false, missingKeys };
};

export const parseIpAddress = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (!forwardedFor) {
    return null;
  }

  const [firstIp] = forwardedFor.split(',').map((segment) => segment.trim());
  return firstIp || null;
};

const buildOwnerNotificationText = ({
  source,
  payload,
  ipAddress,
  userAgent,
}: {
  source: ContactSubmissionSource;
  payload: ContactSubmissionPayload;
  ipAddress?: string | null;
  userAgent?: string | null;
}) => {
  return [
    `New contact submission from ${source}.`,
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    '',
    'Message:',
    payload.message,
    '',
    `IP Address: ${ipAddress || 'Unknown'}`,
    `User Agent: ${userAgent || 'Unknown'}`,
  ].join('\n');
};

const buildAutoReplyText = ({
  payload,
  fromName,
}: {
  payload: ContactSubmissionPayload;
  fromName: string;
}) => {
  return [
    `Hi ${payload.name},`,
    '',
    'Thanks for reaching out. I received your message and will get back to you soon.',
    '',
    'Your message summary:',
    payload.message,
    '',
    'Best regards,',
    fromName,
  ].join('\n');
};

export async function submitContactMessage({
  rawPayload,
  metadata,
}: {
  rawPayload: unknown;
  metadata: ContactSubmissionMetadata;
}): Promise<ContactSubmissionResult> {
  const payloadResult = contactSubmissionSchema.safeParse(rawPayload);
  if (!payloadResult.success) {
    return {
      ok: false,
      type: 'validation',
      error: 'Validation failed.',
      issues: payloadResult.error.issues,
    };
  }

  const configResult = getContactConfig();
  if (!configResult.ok) {
    return {
      ok: false,
      type: 'config',
      error: `Missing required environment variables: ${configResult.missingKeys.join(', ')}`,
    };
  }

  const payload = payloadResult.data;
  const config = configResult.config;
  const sourceLabel = metadata.source === 'terminal' ? 'Terminal Contact' : 'Website Contact';

  try {
    const supabaseAdmin = createAdminClient();
    const { error: insertError } = await supabaseAdmin.from('contact_submissions').insert({
      name: payload.name,
      email: payload.email,
      message: payload.message,
      subject: sourceLabel,
      status: 'new',
      ip_address: metadata.ipAddress || null,
      user_agent: metadata.userAgent || null,
    });

    if (insertError) {
      serverLogger.safeError('Contact submission insert failed', insertError, {
        source: metadata.source,
      });
      return {
        ok: false,
        type: 'database',
        error: 'Failed to save contact message.',
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.CONTACT_SMTP_USER,
        pass: config.CONTACT_SMTP_PASS,
      },
    });

    const ownerMail = transporter.sendMail({
      from: `"${config.CONTACT_AUTOREPLY_FROM_NAME}" <${config.CONTACT_SMTP_USER}>`,
      to: config.CONTACT_NOTIFICATION_EMAIL,
      replyTo: payload.email,
      subject: `[${sourceLabel}] New message from ${payload.name}`,
      text: buildOwnerNotificationText({
        source: metadata.source,
        payload,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      }),
    });

    const autoReplyMail = transporter.sendMail({
      from: `"${config.CONTACT_AUTOREPLY_FROM_NAME}" <${config.CONTACT_SMTP_USER}>`,
      to: payload.email,
      subject: 'Thanks for your message',
      text: buildAutoReplyText({
        payload,
        fromName: config.CONTACT_AUTOREPLY_FROM_NAME,
      }),
    });

    const [ownerResult, autoReplyResult] = await Promise.allSettled([
      ownerMail,
      autoReplyMail,
    ]);

    const mailFailures = [
      ownerResult.status === 'rejected' ? ownerResult.reason : null,
      autoReplyResult.status === 'rejected' ? autoReplyResult.reason : null,
    ].filter(Boolean);

    if (mailFailures.length > 0) {
      serverLogger.safeError('Contact email send partially failed', mailFailures, {
        source: metadata.source,
        failedCount: mailFailures.length,
      });
      return {
        ok: true,
        message: 'Contact message saved successfully.',
        warning:
          'Your message was saved, but one or more confirmation emails could not be delivered.',
        emailStatus: 'partial',
      };
    }

    return {
      ok: true,
      message: 'Contact message saved and emails sent successfully.',
      emailStatus: 'sent',
    };
  } catch (error) {
    serverLogger.safeError('Contact submission service failed unexpectedly', error, {
      source: metadata.source,
    });
    return {
      ok: false,
      type: 'unexpected',
      error: 'Unexpected error while sending contact message.',
    };
  }
}
