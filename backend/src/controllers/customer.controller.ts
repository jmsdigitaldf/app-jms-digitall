import { Response } from 'express';
import type { AuthenticatedRequest } from '../types';
import { customerRepository } from '../repositories';
import { logger } from '../utils';

export const customerController = {
  /**
   * List customers with pagination
   */
  list: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10, search, isActive } = req.query;

      const result = await customerRepository.list({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      logger.error({ error }, 'List customers error');
      throw error;
    }
  },

  /**
   * Get customer by ID
   */
  getById: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const customer = await customerRepository.findById(id);

      if (!customer) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Cliente não encontrado',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      logger.error({ error }, 'Get customer by ID error');
      throw error;
    }
  },

  /**
   * Create new customer
   */
  create: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customer = await customerRepository.create(req.body);

      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('unique')) {
        res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'Telefone já cadastrado',
          },
        });
        return;
      }
      logger.error({ error }, 'Create customer error');
      throw error;
    }
  },

  /**
   * Update customer
   */
  update: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const customer = await customerRepository.update(id, req.body);

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Cliente não encontrado',
          },
        });
        return;
      }
      logger.error({ error }, 'Update customer error');
      throw error;
    }
  },

  /**
   * Delete customer (soft delete)
   */
  delete: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      await customerRepository.update(id, { isActive: false });

      res.status(200).json({
        success: true,
        data: { message: 'Cliente desativado com sucesso' },
      });
    } catch (error) {
      logger.error({ error }, 'Delete customer error');
      throw error;
    }
  },

  /**
   * Get customer statistics
   */
  getStats: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await customerRepository.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error({ error }, 'Get customer stats error');
      throw error;
    }
  },

  /**
   * Search customers by phone (for WhatsApp integration)
   */
  searchByPhone: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { phone } = req.query;

      if (!phone) {
        res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Telefone é obrigatório',
          },
        });
        return;
      }

      const customer = await customerRepository.findByPhone(phone as string);

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      logger.error({ error }, 'Search by phone error');
      throw error;
    }
  },
};

export default customerController;
