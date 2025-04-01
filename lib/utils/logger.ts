type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private formatLogEntry(level: LogLevel, message: string | object, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      data,
    };
  }

  private log(level: LogLevel, message: string | object, data?: unknown): void {
    const logEntry = this.formatLogEntry(level, message, data);
    
    // Only log if not in production mode
    if (process.env.NODE_ENV !== 'production') {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'info';
      console[consoleMethod](
        `[${logEntry.timestamp}] ${logEntry.message}`,
        data ? { data } : {}
      );
    }
  }

  info(message: string | object, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string | object, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(error: Error | string, context?: unknown): void {
    const message = error instanceof Error ? error.message : error;
    const data = error instanceof Error 
      ? { stack: error.stack, context }
      : { context };
    this.log('error', message, data);
  }
}

export const logger = new Logger();
