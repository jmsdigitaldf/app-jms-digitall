import { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types';
import { authService } from '../services';
import { userRepository } from '../repositories';
import { logger } from '../utils';

export const authController = {
  /**
   * Register new user
   */
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Email já cadastrado') {
        res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: error.message,
          },
        });
        return;
      }
      throw error;
    }
  },

  /**
   * Login user
   */
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('inválidos')) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: error.message,
          },
        });
        return;
      }
      throw error;
    }
  },

  /**
   * Refresh token
   */
  refreshToken: async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token de refresh inválido ou expirado',
        },
      });
    }
  },

  /**
   * Logout user
   */
  logout: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Usuário não autenticado',
          },
        });
        return;
      }

      await authService.logout(req.user.userId);

      res.status(200).json({
        success: true,
        data: { message: 'Logout realizado com sucesso' },
      });
    } catch (error) {
      logger.error({ error }, 'Logout error');
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao realizar logout',
        },
      });
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Usuário não autenticado',
          },
        });
        return;
      }

      const user = await userRepository.findByIdWithRelations(req.user.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Usuário não encontrado',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          recentTickets: user.tickets,
        },
      });
    } catch (error) {
      logger.error({ error }, 'Get profile error');
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Usuário não autenticado',
          },
        });
        return;
      }

      const { name, email, avatarUrl } = req.body;

      const user = await userRepository.update(req.user.userId, {
        name,
        email,
        avatarUrl,
      });

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      logger.error({ error }, 'Update profile error');
      throw error;
    }
  },

  /**
   * Change password
   */
  changePassword: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Usuário não autenticado',
          },
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      // Verify current password
      const user = await userRepository.findById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Usuário não encontrado',
          },
        });
        return;
      }

      const isValidPassword = await authService.comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Senha atual incorreta',
          },
        });
        return;
      }

      // Hash new password
      const hashedPassword = await authService.hashPassword(newPassword);

      // Update password
      await userRepository.update(req.user.userId, { password: hashedPassword });

      res.status(200).json({
        success: true,
        data: { message: 'Senha alterada com sucesso' },
      });
    } catch (error) {
      logger.error({ error }, 'Change password error');
      throw error;
    }
  },
};

export default authController;
