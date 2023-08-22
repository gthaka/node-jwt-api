import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'some👨🏽‍👩🏾‍👧🏿‍👦🏾pretty🧠awesome_ish';

export function generateToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '1h' });
}

export function verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}
