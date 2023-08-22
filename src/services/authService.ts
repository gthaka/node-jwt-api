import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import userService from './userService';
import { generateToken, verifyToken } from '../config/jwt';
import pool from '../config/db';
import User from '../models/User';

class AuthService {
    async signup(user: User): Promise<string> {
        const existingUser = await userService.getUserByUsername(user.username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = bcrypt.hashSync(user.password, 10);
        const newUser = { ...user, password: hashedPassword };

        await userService.createUser(newUser);

        const token = generateToken({ userId: newUser.id });
        return token;
    }

    async signin(username: string, password: string): Promise<string | null> {
        const user = await userService.getUserByUsername(username);
        if (!user) {
            return null;
        }

        if (bcrypt.compareSync(password, user.password)) {
            const token = generateToken({ userId: user.id });
            return token;
        }

        return null;
    }

    async setResetToken(userId: number, resetToken: string): Promise<void> {
        const query = `
          UPDATE users
          SET reset_token = $1, reset_token_created_at = NOW()
          WHERE id = $2
        `;
        const values = [resetToken, userId];

        try {
            await pool.query(query, values);
        } catch (error) {
            throw new Error('Error setting reset token');
        }
    }

    async getUserByResetToken(token: string): Promise<User | null> {
        const query = `
          SELECT * FROM users
          WHERE reset_token = $1
        `;
        const values = [token];

        try {
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error('Error fetching user by reset token');
        }
    }

    async clearResetToken(userId: number): Promise<void> {
        const query = `
          UPDATE users
          SET reset_token = NULL, reset_token_created_at = NULL
          WHERE id = $1
        `;
        const values = [userId];

        try {
            await pool.query(query, values);
        } catch (error) {
            throw new Error('Error clearing reset token');
        }
    }

    async verifyResetToken(token: string): Promise<boolean> {
        const user = await userService.getUserByResetToken(token);
        if (!user) {
            return false;
        }


        const isValidToken = user.resetTokenCreatedAt && userService.verifyResetTokenExpiration(user.resetTokenCreatedAt);
        if (!isValidToken) {
            return false;
        }

        return true;
    }

    async generateResetToken(email: string): Promise<string | null> {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return null;
        }
        const resetToken = uuidv4(); // Generate a UUID for the reset token
        await userService.setResetToken(user.id, resetToken);
        return resetToken;
    }

    async resetPassword(token: string, newPassword: string): Promise<boolean> {
        const isValidToken = await this.verifyResetToken(token);
        if (!isValidToken) {
            return false;
        }

        const user = await userService.getUserByResetToken(token);
        if (!user) {
            return false;
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await userService.updatePassword(user.id, hashedPassword);
        await userService.clearResetToken(user.id);

        return true;
    }
}

export default new AuthService();
