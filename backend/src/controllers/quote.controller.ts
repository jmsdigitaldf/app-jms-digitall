import { Response } from 'express';
import type { AuthenticatedRequest } from '../types';
import { quoteRepository, ticketRepository } from '../repositories';
import { whatsappService } from '../services';
import { logger } from '../utils';

export const quoteController = {
  /**
   * List quotes with filters
   */
  list: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10, status, ticketId } = req.query;

      const result = await quoteRepository.list({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        ticketId: ticketId as string,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      logger.error({ error }, 'List quotes error');
      throw error;
    }
  },

  /**
   * Get quote by ID
   */
  getById: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const quote = await quoteRepository.findById(id);

      if (!quote) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Orçamento não encontrado',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: quote,
      });
    } catch (error) {
      logger.error({ error }, 'Get quote by ID error');
      throw error;
    }
  },

  /**
   * Get quotes by ticket ID
   */
  getByTicketId: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { ticketId } = req.params;

      const quotes = await quoteRepository.findByTicketId(ticketId);

      res.status(200).json({
        success: true,
        data: quotes,
      });
    } catch (error) {
      logger.error({ error }, 'Get quotes by ticket ID error');
      throw error;
    }
  },

  /**
   * Create new quote
   */
  create: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { ticketId, ...data } = req.body;

      // Add createdById from authenticated user
      if (req.user) {
        data.createdById = req.user.userId;
      }

      const quote = await quoteRepository.create({
        ticketId,
        ...data,
      });

      res.status(201).json({
        success: true,
        data: quote,
      });
    } catch (error) {
      logger.error({ error }, 'Create quote error');
      throw error;
    }
  },

  /**
   * Update quote
   */
  update: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const quote = await quoteRepository.update(id, req.body);

      res.status(200).json({
        success: true,
        data: quote,
      });
    } catch (error) {
      logger.error({ error }, 'Update quote error');
      throw error;
    }
  },

  /**
   * Approve quote
   */
  approve: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const quote = await quoteRepository.update(id, { status: 'APPROVED' });

      // Update ticket status to APPROVED
      await ticketRepository.update(quote.ticketId, { status: 'APPROVED' });

      res.status(200).json({
        success: true,
        data: quote,
      });
    } catch (error) {
      logger.error({ error }, 'Approve quote error');
      throw error;
    }
  },

  /**
   * Reject quote
   */
  reject: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const quote = await quoteRepository.update(id, { status: 'REJECTED' });

      // Update ticket status to REJECTED
      await ticketRepository.update(quote.ticketId, { status: 'REJECTED' });

      res.status(200).json({
        success: true,
        data: quote,
      });
    } catch (error) {
      logger.error({ error }, 'Reject quote error');
      throw error;
    }
  },

  /**
   * Delete quote
   */
  delete: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      await quoteRepository.delete(id);

      res.status(200).json({
        success: true,
        data: { message: 'Orçamento excluído com sucesso' },
      });
    } catch (error) {
      logger.error({ error }, 'Delete quote error');
      throw error;
    }
  },

  /**
   * Get quote statistics
   */
  getStats: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await quoteRepository.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error({ error }, 'Get quote stats error');
      throw error;
    }
  },

  /**
   * Send quote to customer via WhatsApp
   */
  sendToCustomer: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const quote = await quoteRepository.findById(id);

      if (!quote) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Orçamento não encontrado',
          },
        });
        return;
      }

      const ticket = await ticketRepository.findById(quote.ticketId);

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

      // Send via WhatsApp
      await whatsappService.sendQuoteRequest(
        ticket.customer.phone,
        ticket.protocol,
        Number(quote.price),
        '1-2 dias'
      );

      res.status(200).json({
        success: true,
        data: { message: 'Orçamento enviado ao cliente' },
      });
    } catch (error) {
      logger.error({ error }, 'Send quote to customer error');
      throw error;
    }
  },
};

export default quoteController;
