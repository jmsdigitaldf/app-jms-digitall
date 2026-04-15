import { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types';
import { authService } from '../services';
import { logger } from '../utils';

/**
 * Middleware para verificar autenticação JWT
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token de acesso não fornecido',
        },
      });
      return;
    }

    const token = authHeader.substring(7);
    const payload = await authService.validateToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token inválido ou expirado',
        },
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    logger.error({ error }, 'Auth middleware error');
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno ao validar autenticação',
      },
    });
  }
};

/**
 * Middleware para verificar permissões por role
 */
export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Você não tem permissão para realizar esta ação',
        },
      });
      return;
    }

    next();
  };
};

/**
 * Middleware opcional - adiciona user se existir, mas não falha se não existir
 */
export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await authService.validateToken(token);
      
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch {
    next();
  }
};
