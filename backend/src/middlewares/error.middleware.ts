import { Request, Response, NextFunction } from 'express';
import type { ApiError } from '../types';
import { logger } from '../utils';

/**
 * Middleware global de tratamento de erros
 */
export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  logger.error({
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  }, 'Unhandled error');

  // Default error response
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'Erro interno do servidor';
  let details: unknown = undefined;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = error.message;
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    message = 'Não autorizado';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
    message = 'Acesso proibido';
  } else if (error.message.includes('já cadastrado') || error.message.includes('already exists')) {
    statusCode = 409;
    errorCode = 'CONFLICT';
    message = error.message;
  } else if (error.message.includes('não encontrado') || error.message.includes('not found')) {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
    message = error.message;
  } else if (error.message.includes('inválido') || error.message.includes('invalid')) {
    statusCode = 400;
    errorCode = 'BAD_REQUEST';
    message = error.message;
  }

  // Build error response
  const errorResponse: ApiError = {
    code: errorCode,
    message,
  };

  if (details) {
    errorResponse.details = details;
  }

  res.status(statusCode).json({
    success: false,
    error: errorResponse,
  });
};

/**
 * Middleware para rotas não encontradas (404)
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rota ${req.method} ${req.path} não encontrada`,
    },
  });
};
