import { Product } from '../../src/models/product.model';
import { User } from '../../src/models/user.model';
import mongoose from 'mongoose';

describe('Product Model', () => {
    let userId: mongoose.Types.ObjectId;

    beforeEach(async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });
        userId = user._id as mongoose.Types.ObjectId;
    });

    it('should create a product', async () => {
        const product = await Product.create({
            name: 'Test Product',
            description: 'A test product',
            price: 99.99,
            quantity: 10,
            category: 'Electronics',
            createdBy: userId,
        });

        expect(product.name).toBe('Test Product');
        expect(product.price).toBe(99.99);
        expect(product.quantity).toBe(10);
        expect(product.category).toBe('Electronics');
    });

    it('should require all mandatory fields', async () => {
        await expect(
            Product.create({
                name: 'Test Product',
                createdBy: userId,
            })
        ).rejects.toThrow();
    });

    it('should not allow negative price', async () => {
        await expect(
            Product.create({
                name: 'Test Product',
                description: 'A test product',
                price: -10,
                quantity: 10,
                category: 'Electronics',
                createdBy: userId,
            })
        ).rejects.toThrow();
    });

    it('should populate createdBy field', async () => {
        const product = await Product.create({
            name: 'Test Product',
            description: 'A test product',
            price: 99.99,
            quantity: 10,
            category: 'Electronics',
            createdBy: userId,
        });

        const populated = await Product.findById(product._id).populate('createdBy', 'name email');
        expect((populated?.createdBy as unknown as { name: string }).name).toBe('Test User');
    });
});
