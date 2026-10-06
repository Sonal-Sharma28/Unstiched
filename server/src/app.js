import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
app.use(cors(corsOptions));
// Increase payload limit to 25mb for base64 image uploads
app.use(express.json({ limit: '25mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

app.use('/api', apiRouter);

// Simple health check for Render
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
