interface LogContext {
  error?: { message: string; stack?: string };
  [key: string]: unknown;
}

type LogMethod = 'info' | 'warn' | 'error';

function log(method: LogMethod, message: string, context?: LogContext) {
  const entry: Record<string, unknown> = {
    level: method.toUpperCase(),
    timestamp: new Date().toISOString(),
    message
  };

  if (context) {
    const { error, ...rest } = context;
    if (error) {
      entry.error = { message: error.message };
    }
    Object.assign(entry, rest);
  }

  const output = method === 'error' ? process.stderr : process.stdout;
  output.write(JSON.stringify(entry) + '\n');
}

export const ztaLogger = {
  info(message: string, context?: LogContext) {
    log('info', message, context);
  },
  warn(message: string, context?: LogContext) {
    log('warn', message, context);
  },
  error(message: string, context?: LogContext) {
    log('error', message, context);
  }
};

export function logSecurityEvent(event: {
  action: string;
  userId?: string;
  challenge?: string;
  metadata?: Record<string, unknown>;
}) {
  const payload: Record<string, unknown> = {
    regulatory_tags: ['NIS2_ART_21', 'ZTA_CONTINUOUS_AUTH'],
    ...event
  };

  if (event.action === 'REPLAY_ATTACK_DETECTED') {
    ztaLogger.error(
      `CRITICAL SECURITY ALERT: Auth replay attempt detected for challenge ${event.challenge}`,
      payload
    );
  } else {
    ztaLogger.info(`ZTA Audit Event: ${event.action}`, payload);
  }
}
