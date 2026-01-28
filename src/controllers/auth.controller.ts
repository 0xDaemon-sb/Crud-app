import { Response } from 'express';
import { User } from '../models/user.model';
import { AuthRequest } from '../types';
import { generateToken } from '../middlewares/auth.middleware';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email already registered' });
            return;
        }

        const user = await User.create({ name, email, password, role: role || 'user' });
        const token = generateToken({ _id: user._id.toString(), email: user.email, role: user.role });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user, token },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: (error as Error).message });
    }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const token = generateToken({ _id: user._id.toString(), email: user.email, role: user.role });

        res.json({
            success: true,
            message: 'Login successful',
            data: { user, token },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: (error as Error).message });
    }
};

export const loginSession = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        req.session.userId = user._id.toString();

        res.json({
            success: true,
            message: 'Session login successful',
            data: { user },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: (error as Error).message });
    }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Logout failed' });
                return;
            }
            res.json({ success: true, message: 'Logged out successfully' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Logout failed', error: (error as Error).message });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    res.json({
        success: true,
        data: { user: req.user },
    });
};
