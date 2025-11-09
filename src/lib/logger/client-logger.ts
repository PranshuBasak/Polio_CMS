/**
 * Client-Side Logger
 * Lightweight logging for browser with error tracking integration
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMeta {
  [key: string]: unknown;
}

class ClientLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log to console and external service (Sentry, LogRocket, etc.)
   */
  private log(level: LogLevel, message: string, meta?: LogMeta) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...meta,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    // Console logging (always in development, errors in production)
    if (this.isDevelopment || level === 'error') {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}]`, message, meta);
    }

    // Send to external service in production
    if (!this.isDevelopment && level === 'error') {
      this.sendToExternalService(logData);
    }
  }

  /**
   * Send error to external monitoring service
   * Integrate with Sentry, LogRocket, Datadog, etc.
   */
  private sendToExternalService(logData: Record<string, unknown>) {
    // Example: Send to your API endpoint
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(logData)], { type: 'application/json' });
      navigator.sendBeacon('/api/logs', blob);
    }

    // Example: Sentry integration
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureException(new Error(logData.message as string), {
    //     extra: logData,
    //   });
    // }
  }

  info(message: string, meta?: LogMeta) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | unknown, meta?: LogMeta) {
    const errorMeta: LogMeta = { ...meta };

    if (error instanceof Error) {
      errorMeta.error = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    } else if (error) {
      errorMeta.error = error;
    }

    this.log('error', message, errorMeta);
  }

  debug(message: string, meta?: LogMeta) {
    if (this.isDevelopment) {
      this.log('debug', message, meta);
    }
  }

  /**
   * Track user interactions
   */
  trackEvent(eventName: string, properties?: Record<string, unknown>) {
    this.info(`Event: ${eventName}`, { type: 'analytics', properties });
  }

  /**
   * Track page views
   */
  trackPageView(url: string) {
    this.info('Page View', { type: 'pageview', url });
  }
}

// Singleton instance
export const clientLogger = new ClientLogger();

export default clientLogger;
