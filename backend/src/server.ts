import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import publicRoutes from './routes/public.route';
import adminRoutes from './routes/admin.routes';
import { db } from './config/database';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.PORTFOLIO_FRONTEND_URL || 'http://localhost:3000',
  process.env.ADMIN_FRONTEND_URL    || 'http://localhost:3001',
].map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS: Blocked request from origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true
}));

// ─── Compression ─────────────────────────────────────────────────────────────
// Gzip all JSON responses — reduces payload size by ~70% over the wire
app.use(compression());

// ─── Body Parsing ────────────────────────────────────────────────────────────
// 1mb is plenty — base64 images are rejected at controller level anyway
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Public read endpoints: generous limit (200 req/min per IP)
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' }
});

// Admin write endpoints: strict limit (30 req/min per IP)
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many admin requests. Please slow down.' }
});

// ─── Preflight (OPTIONS) ──────────────────────────────────────────────────────
// Explicitly handle CORS preflight before any rate limiter so OPTIONS requests
// are never blocked or counted against the rate limit.
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
}));

// ─── Routes ───────────────────────────────────────────────────────────────────

// Aggregate endpoint — returns all portfolio data in ONE round trip
// This eliminates 5 extra fetches from the frontend (6 → 1)
app.get('/api/v1/portfolio', publicLimiter, async (req: Request, res: Response) => {
  try {
    // Run all 6 DB queries in parallel — same cost as before, but only 1 HTTP round trip
    const [homepageRes, experiencesRes, educationRes, projectsRes, skillsRes, certificatesRes] = await Promise.all([
      db.from('Homepage').select('*').limit(1),
      db.from('Experiance').select('*').order('start_date', { ascending: false }),
      db.from('Education').select('*').order('start_date', { ascending: false }),
      db.from('Projects').select('*').order('id', { ascending: false }),
      db.from('Skills').select('*').order('id', { ascending: true }),
      db.from('Certificates').select('*').order('date_received', { ascending: false }),
    ]);

    // Cache for 5 minutes in shared caches (CDN), serve stale for 10 min while revalidating
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    res.status(200).json({
      success: true,
      data: {
        homepage: homepageRes.data?.[0] ?? null,
        experiences: experiencesRes.data ?? [],
        education: educationRes.data ?? [],
        projects: projectsRes.data ?? [],
        skills: skillsRes.data ?? [],
        certificates: certificatesRes.data ?? [],
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Internal Server Error fetching portfolio data.' });
  }
});

// Public read-only endpoints
app.use('/api/v1', publicLimiter, publicRoutes);

// Admin write/update endpoints (JWT-protected + stricter rate limit)
app.use('/api/v1/admin', adminLimiter, adminRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', service: 'portfolio-backend' });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});