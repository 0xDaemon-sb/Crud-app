import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AuthRequest, JwtPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const generateToken = (user: { _id: string; email: string; role: string }): string => {
    return jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );
};

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const user = await User.findById(decoded.userId);

        if (!user) {
            res.status(401).json({ success: false, message: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export const authenticateSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.session?.userId) {
            res.status(401).json({ success: false, message: 'No session found' });
            return;
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            res.status(401).json({ success: false, message: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch {
        res.status(401).json({ success: false, message: 'Session error' });
    }
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authenticateJWT(req, res, next);
    }
    if (req.session?.userId) {
        return authenticateSession(req, res, next);
    }
    res.status(401).json({ success: false, message: 'Authentication required' });
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Admin access required' });
        return;
    }
    next();
};
