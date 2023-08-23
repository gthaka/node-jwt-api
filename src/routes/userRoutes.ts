import { Router } from 'express';
import { getUserDetails } from '../controllers/userController';
import { authMiddleware, emailVerificationMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * /users/details:
 *   get:
 *     summary: Get user details
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []  # Bearer token required
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/details', authMiddleware, emailVerificationMiddleware, getUserDetails);

export default router;
