/**
 * Server-Side Logger
 * Lightweight, Node-safe logger for Next.js App Router.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const isDevelopment = process.env.NODE_ENV === 'development';
const debugModeCacheTtlMs = 30_000;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type LogMeta = Record<string, unknown> | undefined;
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

let cachedDbDebugMode: boolean | null = null;
let lastDebugModeRefreshAt = 0;
let debugModeFetchPromise: Promise<void> | null = null;

const parseEnvBoolean = (value: string | undefined): boolean | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'on') {
    return true;
  }

  if (normalized === 'false' || normalized === '0' || normalized === 'off') {
    return false;
  }

  return null;
};

const getDefaultLoggingEnabled = () => {
  const envOverride = parseEnvBoolean(process.env.LOG_ENABLED);
  if (typeof envOverride === 'boolean') {
    return envOverride;
  }

  return isDevelopment;
};

const extractDebugModeFromAdvanced = (advanced: unknown): boolean | null => {
  if (!advanced || typeof advanced !== 'object') {
    return null;
  }

  const maybeDebugMode = (advanced as { debugMode?: unknown }).debugMode;
  if (typeof maybeDebugMode !== 'boolean') {
    return null;
  }

  return maybeDebugMode;
};

const refreshDebugModeFromDb = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return;
  }

  try {
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('site_settings')
      .select('advanced, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const parsedDebugMode = extractDebugModeFromAdvanced(data?.advanced);
    cachedDbDebugMode =
      typeof parsedDebugMode === 'boolean'
        ? parsedDebugMode
        : getDefaultLoggingEnabled();
    lastDebugModeRefreshAt = Date.now();
  } catch {
    if (typeof cachedDbDebugMode !== 'boolean') {
      cachedDbDebugMode = getDefaultLoggingEnabled();
    }
    lastDebugModeRefreshAt = Date.now();
  }
};

const scheduleDebugModeRefresh = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return;
  }

  const now = Date.now();
  if (now - lastDebugModeRefreshAt < debugModeCacheTtlMs) {
    return;
  }

  if (debugModeFetchPromise) {
    return;
  }

  debugModeFetchPromise = refreshDebugModeFromDb().finally(() => {
    debugModeFetchPromise = null;
  });
};

const isLoggingEnabled = () => {
  scheduleDebugModeRefresh();

  if (typeof cachedDbDebugMode === 'boolean') {
    return cachedDbDebugMode;
  }

  return getDefaultLoggingEnabled();
};

const serializeError = (error?: Error | unknown) => {
  if (!error) {
    return undefined;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  }

  return error;
};

const emit = (
  level: LogLevel,
  message: string,
  meta?: LogMeta,
  error?: Error | unknown
) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    env: process.env.NODE_ENV,
    revision: process.env.VERCEL_GIT_COMMIT_SHA,
    ...(meta ?? {}),
    ...(error ? { error: serializeError(error) } : {}),
  };

  const prefix = `[${level.toUpperCase()}] ${message}`;

  switch (level) {
    case 'debug':
      console.debug(prefix, payload);
      break;
    case 'info':
      console.info(prefix, payload);
      break;
    case 'warn':
      console.warn(prefix, payload);
      break;
    case 'error':
      console.error(prefix, payload);
      break;
    default:
      console.log(prefix, payload);
  }
};

const safeLog = (
  level: LogLevel,
  message: string,
  meta?: LogMeta,
  error?: Error | unknown
) => {
  if (!isLoggingEnabled()) {
    return;
  }

  try {
    emit(level, message, meta, error);
  } catch (loggingError) {
    console.error('[SERVER][LOGGER_FAILURE]', {
      message,
      level,
      loggingError: serializeError(loggingError),
    });
  }
};

/**
 * Structured logging methods
 */
export const serverLogger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    safeLog('info', message, meta);
  },

  error: (message: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
    safeLog('error', message, meta, error);
  },

  warn: (message: string, meta?: Record<string, unknown>) => {
    safeLog('warn', message, meta);
  },

  debug: (message: string, meta?: Record<string, unknown>) => {
    safeLog('debug', message, meta);
  },

  http: (message: string, meta?: Record<string, unknown>) => {
    safeLog('info', message, { type: 'http', ...(meta ?? {}) });
  },

  safeInfo: (message: string, meta?: Record<string, unknown>) => {
    serverLogger.info(message, meta);
  },

  safeWarn: (message: string, meta?: Record<string, unknown>) => {
    serverLogger.warn(message, meta);
  },

  safeDebug: (message: string, meta?: Record<string, unknown>) => {
    serverLogger.debug(message, meta);
  },

  safeError: (message: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
    serverLogger.error(message, error, meta);
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
