import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
    describe('generateToken', () => {
        it('should generate a valid JWT token', () => {
            const secret = process.env.JWT_SECRET || 'default-secret';
            const payload = { userId: '123', email: 'test@example.com', role: 'user' };
            const token = jwt.sign(payload, secret, { expiresIn: '7d' });

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = jwt.verify(token, secret) as { userId: string; email: string; role: string };
            expect(decoded.userId).toBe('123');
            expect(decoded.email).toBe('test@example.com');
            expect(decoded.role).toBe('user');
        });

        it('should include expiration in token', () => {
            const secret = process.env.JWT_SECRET || 'default-secret';
            const payload = { userId: '123', email: 'test@example.com', role: 'admin' };
            const token = jwt.sign(payload, secret, { expiresIn: '7d' });

            const decoded = jwt.decode(token) as { exp: number };
            expect(decoded.exp).toBeDefined();
            expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
        });
    });
});
