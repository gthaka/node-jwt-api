import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware'
import authController from '../controllers/authController';

const router = Router();

router.post('/signup', authController.signup);
router.post('/signin', authMiddleware, authController.signin);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification-email', authController.resendVerificationEmail);

export default router;
