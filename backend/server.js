import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb } from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import configRoutes from './src/routes/config.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true, credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/config', configRoutes);

app.get('/health', (_, res) => res.json({ ok: true }));

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
