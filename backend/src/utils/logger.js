import winston from 'winston';
import { getConfig } from '../config/env.js';

const config = getConfig();

// Log format: JSON with timestamp, level, message, metadata
const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports
const transports = [
  // Console transport (always enabled)
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${timestamp} [${level}] ${message} ${metaStr}`;
      })
    )
  })
];

// File transport for errors (in production)
if (config.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: jsonFormat
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: jsonFormat
    })
  );
}

// Create logger instance
const winstonLogger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: jsonFormat,
  transports,
  // Don't exit on handled exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Add fatal method (alias for error with higher priority)
winstonLogger.fatal = function(message, meta = {}) {
  return this.error(message, { ...meta, is_fatal: true });
};

export const logger = winstonLogger;

// Datadog integration (if API key provided)
if (config.DD_API_KEY) {
  logger.info('Datadog integration enabled', { api_key_set: true });
  // In production, add Datadog transport here
  // This would require datadog-browser-logs or similar
}

export default logger;
