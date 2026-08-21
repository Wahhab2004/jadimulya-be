import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

export function createApp(): Application {
  const app = express();

  const allowedOrigins = [
    'http://localhost:3000',
    'https://jadimulya-pangandaran.id',
    'https://www.jadimulya-pangandaran.id',
  ];

  app.set('trust proxy', 1);

  // --- Security & CORS ---
  app.use(
    cors({
      origin: (origin, callback) => {
        // Izinkan request tanpa Origin
        // (misalnya server-to-server, Postman, curl)
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.use(helmet());

  // --- Parsing dasar ---
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // --- Logging ---
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

  // --- Rate limiting ---
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // --- File statis hasil upload ---
  app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

  // --- Health check ---
  app.get('/health', (_req, res) =>
    res.json({
      status: 'ok',
      env: env.NODE_ENV,
    }),
  );

  // --- API routes ---
  app.use('/api/v1', routes);

  // --- Error handler ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
