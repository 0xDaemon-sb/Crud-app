import { Request } from 'express';
import { IUser } from '../models/user.model';

declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

export interface AuthRequest extends Request {
    user?: IUser;
}

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}
