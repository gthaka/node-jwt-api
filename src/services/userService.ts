import pool from '../config/db';
import User from '../models/User';
import bcrypt from 'bcrypt';

class UserService {
    async createUser(userData: Partial<User>): Promise<User> {
        const query = `
          INSERT INTO users (username, email, password, email_verification_token)
          VALUES ($1, $2, $3, $4)
          RETURNING id, username, email
        `;
        const values = [userData.username, userData.email, userData.password, userData.emailVerificationToken];

        try {
            const result = await pool.query(query, values);
            const newUser = result.rows[0];
            return newUser;
        } catch (error) {
            throw new Error('Error creating user');
        }
    }

    async getUserById(userId: string): Promise<User | null> {
        const query = `
          SELECT id, username, email, reset_token, reset_token_created_at, is_verified
          FROM users
          WHERE id = $1
        `;
        const values = [userId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error('Error fetching user by ID');
        }
    }

    async getUserByUsernameOrEmail(username: string, email: string): Promise<User | null> {
        const query = `
          SELECT id, username, email, password, reset_token, reset_token_created_at
          FROM users
          WHERE username = $1 OR email = $2
        `;
        const values = [username, email];

        try {
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error fetching user by username or email:', error);
            throw new Error('Error fetching user by username or email');
        }
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const query = `
      SELECT * FROM users
      WHERE username = $1
    `;
        const values = [username];

        try {
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error('Error fetching user by username');
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const query = `
      SELECT * FROM users
      WHERE email = $1
    `;
        const values = [email];

        try {
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error('Error fetching user by email');
        }
    }

    async setResetToken(userId: string, resetToken: string): Promise<void> {
        try {
            const query = `
            UPDATE users
            SET reset_token = $1, reset_token_created_at = NOW()
            WHERE id = $2
          `;
            const values = [resetToken, userId];

            await pool.query(query, values);

            console.log('Reset token set successfully');
        } catch (error) {
            console.error('Error setting reset token:', error);
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

    async clearResetToken(userId: string): Promise<void> {
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

    async updatePassword(userId: string, newPassword: string): Promise<void> {
        const query = `
          UPDATE users
          SET password = $1
          WHERE id = $2
        `;
        const values = [newPassword, userId];

        try {
            await pool.query(query, values);
        } catch (error) {
            throw new Error('Error updating password');
        }
    }

    async verifyResetTokenExpiration(tokenCreatedAt: Date): Promise<boolean> {
        const timeout = parseInt(process.env.RESET_TOKEN_EXPITY!) || 30 * 60 * 1000 // defaults 30 minutes expiration
        const expirationTime = new Date(tokenCreatedAt.getTime() + timeout);
        return Date.now() <= expirationTime.getTime();
    }
    async setResetTokenByEmail(email: string, resetToken: string): Promise<boolean> {
        try {
            const query = `
            UPDATE users
            SET reset_token = $1, reset_token_created_at = NOW()
            WHERE email = $2
          `;
            const values = [resetToken, email];
            await pool.query(query, values);
            return true;
        } catch (error) {
            console.error('Error setting reset token:', error);
            return false;
        }
    }

    async verifyResetToken(token: string): Promise<boolean> {
        // Implement logic to verify if the token exists and is valid
        // Return true if valid, false otherwise
        try {
            // Query the database to check if the reset token is valid
            const query = `
            SELECT id FROM users
            WHERE reset_token = $1 AND reset_token_created_at >= NOW() - INTERVAL '1 hour'
          `;
            const result = await pool.query(query, [token]);

            // If a user is found, the token is valid
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error verifying reset token:', error);
            return false;
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<boolean> {
        // Implement logic to reset the user's password
        try {
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            const query = `
            UPDATE users
            SET password = $1, reset_token = NULL, reset_token_created_at = NULL
            WHERE reset_token = $2
          `;
            const values = [hashedPassword, token];
            await pool.query(query, values);
            return true;
        } catch (error) {
            console.error('Error resetting password:', error);
            return false;
        }
    }

    async verifyEmailToken(token: string): Promise<boolean> {
        try {
            const query = `
            UPDATE users
            SET is_verified = true, email_verification_token=NULL
            WHERE email_verification_token = $1
          `;
            const result = await pool.query(query, [token]);

            // If a row is affected, the token was valid and email is now verified
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error verifying email token:', error);
            return false;
        }
    }

    async updateVerificationTokenByEmail(email: string, newToken: string): Promise<boolean> {
        try {
            const query = `
            UPDATE users
            SET is_verified=false, email_verification_token = $1
            WHERE email = $2
          `;
            await pool.query(query, [newToken, email]);
            return true;
        } catch (error) {
            console.error('Error updating verification token:', error);
            return false;
        }
    }
}

export default new UserService();
