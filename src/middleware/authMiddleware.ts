import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import userService from '../services/userService';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>> {

    // Check if user is verified, except for the sign-in route
    if (req.path !== '/signin') {
        const token = req.headers.authorization?.split(' ')[1]; // Assuming token is sent as "Bearer <token>"

        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing' });
        }

        try {
            const decodedToken = verifyToken(token);

            // Attach the decoded user ID to the request for future use
            (req as any).userId = decodedToken.userId; // Type assertion to any

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } else {
        next();
    }
}

export async function emailVerificationMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token from the header
        if (!token) {
            res.status(401).json({ message: 'Authorization token not provided' });
            return;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decodedToken.userId;

        const user = await userService.getUserById(userId);
        if (!user || !user.is_verified) {
            res.status(401).json({ message: 'Email verification required' });
            return;
        }

        next();
    } catch (error) {
        console.error('Error in email verification middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
