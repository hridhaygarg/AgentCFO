import cors from 'cors';
import { logger } from '../../utils/logger.js';

const allowedOrigins = [
  'https://layeroi.com',
  'https://www.layeroi.com',
  'https://app.layeroi.com',
  'http://localhost:3000',
  'http://localhost:5173',
];

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked origin', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-layeroi-Key',
    'X-Agent-Name',
    'X-Agent-Version',
    'X-Task-Name',
    'X-Business-Value',
    'webhook-signature',
    'x-webhook-signature',
    'x-dodo-signature',
  ],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400,
});

export const corsOptions = cors();
