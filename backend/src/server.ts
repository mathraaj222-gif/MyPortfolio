import express, { Application, Request, Response} from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import publicRoutes from './routes/public.route';
import adminRoutes from './routes/admin.routes'; // Import your new Admin routes module

//Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Bind public endpoints (Read Only)
app.use('/api/v1', publicRoutes);

// Bind administrative endpoints (Write/Update operations)
// Notice how we add a distinct "/admin" path namespace prefix
app.use('/api/v1/admin', adminRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK", service: "portfolio-backend" });
});

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({status: "Velai seiyudhu", timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});