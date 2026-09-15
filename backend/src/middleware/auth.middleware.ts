import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Auth Middleware — verifies the Bearer JWT token sent by the admin panel.
 *
 * The admin panel must send every write request with:
 *   Authorization: Bearer <token>
 *
 * The JWT is signed using ADMIN_SECRET from the .env file.
 * Set ADMIN_SECRET to a long random string in production.
 *
 * To generate a valid token for the admin panel, run:
 *   node -e "const jwt=require('jsonwebtoken');console.log(jwt.sign({role:'admin'},process.env.ADMIN_SECRET,{expiresIn:'90d'}))"
 */

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or malformed Authorization header. Expected: Bearer <token>'
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    console.error('ADMIN_SECRET is not set in environment variables. Cannot verify admin tokens.');
    res.status(500).json({
      success: false,
      message: 'Server misconfiguration: Authentication secret is not configured.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { role?: string };

    if (decoded.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Token does not have admin privileges.'
      });
      return;
    }

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Unauthorized: Token has expired.' });
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized: Invalid token.' });
    }
  }
};
