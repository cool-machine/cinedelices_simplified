import { describe, test, expect } from '@jest/globals';

process.env.SESSION_SECRET = 'test-secret';

import { generateToken, verifyToken } from '../../src/utils/jwt.js';

describe('jwt utilities', () => {
    test('generates and verifies a token with expected payload', () => {
        const user = { id: 42, email: 'chef@example.com', role: 'admin' };

        const token = generateToken(user);
        const payload = verifyToken(token);

        expect(payload).toMatchObject({
            id: user.id,
            email: user.email,
            role: user.role
        });
        expect(typeof payload.exp).toBe('number');
    });

    test('throws when token is invalid', () => {
        expect(() => verifyToken('not-a-valid-token')).toThrow();
    });
});
