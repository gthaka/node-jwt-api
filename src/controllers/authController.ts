import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import authService from '../services/authService';
import userService from '../services/userService';
import { sendResetTokenEmail, sendVerificationEmail } from '../utils/emailUtils';

dotenv.config();

class AuthController {
    async signup(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password } = req.body;

            // Validate input data (e.g., check for required fields)
            // Validate input data
            if (!username || !email || !password) {
                res.status(400).json({ message: 'All fields are required' });
                return;
            }

            // Check if the username or email is already taken
            const existingUser = await userService.getUserByUsernameOrEmail(username, email);
            if (existingUser) {
                res.status(409).json({ message: 'Username or email already taken' });
                return;
            }

            // Hash the password using bcrypt
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Generate a verification token
            const verificationToken = uuidv4();

            // Create a new user
            const newUser = await userService.createUser({
                username,
                email,
                password: hashedPassword,
                emailVerificationToken: verificationToken, // Update the createUser method to accept the token
            });

            // Send verification email to the user
            sendVerificationEmail(email, verificationToken);

            // Generate a JWT token
            const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

            res.status(201).json({ message: 'Signup successful. You should recieve an email with a verification token', token });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async signin(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            // Validate input data (e.g., check for required fields)

            // Retrieve the user by username
            const user = await userService.getUserByUsername(username);

            if (!user || !bcrypt.compareSync(password, user.password)) {
                res.status(401).json({ message: 'Invalid username or password' });
                return;
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

            res.json({ message: 'Signin successful', token });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async generateResetToken(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const resetToken = await authService.generateResetToken(email);
        if (!resetToken) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Send the reset token to the user's email
        res.json({ message: 'Reset token generated and sent to your email' });
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        // Generate reset token
        const resetToken = uuidv4();

        // Save reset token in the database
        const success = await userService.setResetTokenByEmail(email, resetToken);

        if (success) {
            // Send reset token email to the user
            sendResetTokenEmail(email, resetToken);

            res.status(200).json({ message: 'Reset token sent to your email' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Verify reset token
        const isValidToken = await userService.verifyResetToken(token);
        if (!isValidToken) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }

        // Reset user's password
        const resetSuccess = await userService.resetPassword(token, newPassword);
        if (resetSuccess) {
            res.status(200).json({ message: 'Password reset successful' });
        } else {
            res.status(500).json({ message: 'Error resetting password' });
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        const { token } = req.params;

        // Verify email verification token
        const verificationSuccess = await userService.verifyEmailToken(token);

        if (verificationSuccess) {
            res.status(200).json({ message: 'Email verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid or expired verification token' });
        }
    }

    async resendVerificationEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        // Generate a new verification token
        const verificationToken = uuidv4();

        // Save the new token in the database
        const success = await userService.updateVerificationTokenByEmail(email, verificationToken);

        if (success) {
            // Send the verification email with the new token
            sendVerificationEmail(email, verificationToken);

            res.status(200).json({ message: 'Verification email sent' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
}

export default new AuthController();
