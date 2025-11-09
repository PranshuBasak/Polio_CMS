/**
 * Server-Side Logger using Pino
 * Production-grade logging for Next.js App Router
 */

import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Pino configuration
const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

  // Pretty print in development, JSON in production
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,

  // Production formatting
  formatters: {
    level: (label: string) => ({ level: label }),
  },

  // Base fields for all logs
  base: {
    env: process.env.NODE_ENV,
    revision: process.env.VERCEL_GIT_COMMIT_SHA,
  },

  // Redact sensitive data
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token'],
    remove: true,
  },
});

/**
 * Structured logging methods
 */
export const serverLogger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    logger.info(meta, message);
  },

  error: (message: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
    if (error instanceof Error) {
      logger.error(
        {
          ...meta,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        },
        message
      );
    } else {
      logger.error({ ...meta, error }, message);
    }
  },

  warn: (message: string, meta?: Record<string, unknown>) => {
    logger.warn(meta, message);
  },

  debug: (message: string, meta?: Record<string, unknown>) => {
    logger.debug(meta, message);
  },

  http: (message: string, meta?: Record<string, unknown>) => {
    logger.info({ type: 'http', ...meta }, message);
  },
};

/**
 * HTTP Request logger middleware
 */
export function logRequest(
  req: { method?: string; url?: string; headers?: Record<string, unknown> },
  startTime: number
) {
  const duration = Date.now() - startTime;

  serverLogger.http('HTTP Request', {
    method: req.method,
    url: req.url,
    duration: `${duration}ms`,
    userAgent: req.headers?.['user-agent'],
  });
}

export default serverLogger;
