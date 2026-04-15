import { Router } from 'express';
import { authController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validate } from '../middlewares';
import { loginSchema, registerSchema, refreshTokenSchema, updateProfileSchema, changePasswordSchema } from '../schemas';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authMiddleware, authController.getProfile);

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile);

/**
 * @route PUT /api/auth/password
 * @desc Change password
 * @access Private
 */
router.put('/password', authMiddleware, validate(changePasswordSchema), authController.changePassword);

export default router;
