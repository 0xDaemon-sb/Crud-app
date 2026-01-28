import { Response } from 'express';
import { Product } from '../models/product.model';
import { AuthRequest } from '../types';

export const getAllProducts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const { category, search } = req.query;

        const filter: Record<string, unknown> = {};
        if (category) filter.category = category;
        if (search) filter.$text = { $search: search as string };

        const [products, total] = await Promise.all([
            Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('createdBy', 'name email'),
            Product.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: {
                products,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products', error: (error as Error).message });
    }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, data: { product } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch product', error: (error as Error).message });
    }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description, price, quantity, category } = req.body;
        const product = await Product.create({
            name,
            description,
            price,
            quantity,
            category,
            createdBy: req.user?._id,
        });

        res.status(201).json({ success: true, message: 'Product created', data: { product } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create product', error: (error as Error).message });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }

        const isOwner = product.createdBy.toString() === req.user?._id.toString();
        const isAdmin = req.user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        const { name, description, price, quantity, category } = req.body;
        const updated = await Product.findByIdAndUpdate(
            id,
            { name, description, price, quantity, category },
            { new: true, runValidators: true }
        );

        res.json({ success: true, message: 'Product updated', data: { product: updated } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update product', error: (error as Error).message });
    }
};

export const patchProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }

        const isOwner = product.createdBy.toString() === req.user?._id.toString();
        const isAdmin = req.user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.json({ success: true, message: 'Product updated', data: { product: updated } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update product', error: (error as Error).message });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }

        const isOwner = product.createdBy.toString() === req.user?._id.toString();
        const isAdmin = req.user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        await Product.findByIdAndDelete(id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete product', error: (error as Error).message });
    }
};
