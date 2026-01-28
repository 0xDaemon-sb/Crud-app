import { User } from '../../src/models/user.model';

describe('User Model', () => {
    it('should create a user with hashed password', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@example.com');
        expect(user.password).not.toBe('password123');
        expect(user.role).toBe('user');
    });

    it('should compare password correctly', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

        const isMatch = await user.comparePassword('password123');
        const isNotMatch = await user.comparePassword('wrongpassword');

        expect(isMatch).toBe(true);
        expect(isNotMatch).toBe(false);
    });

    it('should not allow duplicate emails', async () => {
        await User.create({
            name: 'User 1',
            email: 'duplicate@example.com',
            password: 'password123',
        });

        await expect(
            User.create({
                name: 'User 2',
                email: 'duplicate@example.com',
                password: 'password456',
            })
        ).rejects.toThrow();
    });

    it('should exclude password from JSON', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

        const json = user.toJSON();
        expect(json.password).toBeUndefined();
    });
});
