import { Router } from 'express';
import { authMiddleware, emailVerificationMiddleware } from '../middleware/authMiddleware'
import authController from '../controllers/authController';
import { getUserDetails } from '../controllers/userController';

const router = Router();

// Signup and signin endpoints
router.post('/signup', authController.signup);
router.post('/signin', emailVerificationMiddleware, authController.signin);

// Password reset endpoints
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Email verification endpoint
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification-email', authController.resendVerificationEmail);

// Protected user details endpoint
router.get('/user-details', authMiddleware, emailVerificationMiddleware, getUserDetails);

export default router;
