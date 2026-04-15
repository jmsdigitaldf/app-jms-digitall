import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import type { ApiError } from '../types';
import { logger } from '../utils';

/**
 * Middleware para validação de schemas Zod
 */
export const validate = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body
      if (req.body) {
        req.body = schema.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn({ errors }, 'Validation error');

        const errorResponse: ApiError = {
          code: 'VALIDATION_ERROR',
          message: 'Erro de validação',
          details: errors,
        };

        res.status(400).json({
          success: false,
          error: errorResponse,
        });
        return;
      }

      next(error);
    }
  };
};

/**
 * Middleware para validação de query params
 */
export const validateQuery = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (req.query) {
        req.query = schema.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const errorResponse: ApiError = {
          code: 'VALIDATION_ERROR',
          message: 'Erro de validação nos parâmetros',
          details: errors,
        };

        res.status(400).json({
          success: false,
          error: errorResponse,
        });
        return;
      }

      next(error);
    }
  };
};

/**
 * Middleware para validação de params
 */
export const validateParams = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (req.params) {
        req.params = schema.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const errorResponse: ApiError = {
          code: 'VALIDATION_ERROR',
          message: 'Erro de validação nos parâmetros da URL',
          details: errors,
        };

        res.status(400).json({
          success: false,
          error: errorResponse,
        });
        return;
      }

      next(error);
    }
  };
};
