import { Response } from 'express';
import { User } from '../models/user.model';
import { AuthRequest } from '../types';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(),
        ]);

        res.json({
            success: true,
            data: {
                users,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users', error: (error as Error).message });
    }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, data: { user } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user', error: (error as Error).message });
    }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const isOwner = req.user?._id.toString() === id;
        const isAdmin = req.user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        const { name, email, password } = req.body;
        const updateData: Record<string, unknown> = { name, email };
        if (password) updateData.password = password;

        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.json({ success: true, message: 'User updated', data: { user } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user', error: (error as Error).message });
    }
};

export const patchUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const isOwner = req.user?._id.toString() === id;
        const isAdmin = req.user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.json({ success: true, message: 'User updated', data: { user } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user', error: (error as Error).message });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user', error: (error as Error).message });
    }
};
