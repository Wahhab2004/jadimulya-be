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

  app.set('trust proxy', 1);

  // --- Security & parsing dasar ---
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  

  // --- Logging ---
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

  // --- Rate limiting dasar (NFR-04 Security) ---
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

  // --- Health check (dipakai load balancer / uptime monitor) ---
  app.get('/health', (_req, res) => res.json({ status: 'ok', env: env.NODE_ENV }));

  // --- API routes ---
  app.use('/api/v1', routes);

  // --- 404 & error handler (WAJIB paling akhir) ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
