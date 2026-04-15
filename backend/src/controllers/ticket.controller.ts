import { Response } from 'express';
import type { AuthenticatedRequest } from '../types';
import { ticketRepository, quoteRepository } from '../repositories';
import { whatsappService } from '../services';
import { logger } from '../utils';

export const ticketController = {
  /**
   * List tickets with filters and pagination
   */
  list: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;

      const result = await ticketRepository.list({
        page: Number(page),
        limit: Number(limit),
        filters: filters as Record<string, unknown>,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      logger.error({ error }, 'List tickets error');
      throw error;
    }
  },

  /**
   * Get ticket by ID
   */
  getById: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const ticket = await ticketRepository.findById(id);

      if (!ticket) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Atendimento não encontrado',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      logger.error({ error }, 'Get ticket by ID error');
      throw error;
    }
  },

  /**
   * Get ticket by protocol
   */
  getByProtocol: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { protocol } = req.params;

      const ticket = await ticketRepository.findByProtocol(protocol);

      if (!ticket) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Atendimento não encontrado',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      logger.error({ error }, 'Get ticket by protocol error');
      throw error;
    }
  },

  /**
   * Create new ticket
   */
  create: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ticket = await ticketRepository.create(req.body);

      res.status(201).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      logger.error({ error }, 'Create ticket error');
      throw error;
    }
  },

  /**
   * Update ticket
   */
  update: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const ticket = await ticketRepository.update(id, req.body);

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      logger.error({ error }, 'Update ticket error');
      throw error;
    }
  },

  /**
   * Update ticket status
   */
  updateStatus: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, reason, notifyCustomer } = req.body;

      const ticket = await ticketRepository.updateStatus(id, status, reason);

      // Notify customer via WhatsApp if requested
      if (notifyCustomer) {
        const customer = await ticketRepository.findById(id).then(t => t?.customer);
        if (customer) {
          await whatsappService.sendTicketUpdate(customer.phone, ticket.protocol, status, reason);
        }
      }

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      logger.error({ error }, 'Update ticket status error');
      throw error;
    }
  },

  /**
   * Delete ticket
   */
  delete: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Soft delete by updating status to CANCELLED
      await ticketRepository.updateStatus(id, 'CANCELLED', 'Excluído pelo usuário');

      res.status(200).json({
        success: true,
        data: { message: 'Atendimento cancelado com sucesso' },
      });
    } catch (error) {
      logger.error({ error }, 'Delete ticket error');
      throw error;
    }
  },

  /**
   * Get ticket statistics
   */
  getStats: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await ticketRepository.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error({ error }, 'Get ticket stats error');
      throw error;
    }
  },

  /**
   * Get status history for a ticket
   */
  getStatusHistory: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const history = await ticketRepository.getStatusHistory(id);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      logger.error({ error }, 'Get status history error');
      throw error;
    }
  },

  /**
   * Assign ticket to technician
   */
  assign: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { assignedToId } = req.body;

      const ticket = await ticketRepository.update(id, { assignedToId });

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      logger.error({ error }, 'Assign ticket error');
      throw error;
    }
  },
};

export default ticketController;
