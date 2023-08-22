import { Request, Response } from 'express';
import userService from '../services/userService';

export async function getUserDetails(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>> {
    const userId = (req as any).userId;

    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user details without sensitive information
        const userWithoutPassword = { ...user, password: undefined, reset_token: undefined, reset_token_created_at: undefined, is_verified: undefined };
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}