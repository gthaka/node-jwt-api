import { Router } from 'express';
import { getUserDetails } from '../controllers/userController';
import { authMiddleware, emailVerificationMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/details', authMiddleware, emailVerificationMiddleware, getUserDetails);

export default router;
