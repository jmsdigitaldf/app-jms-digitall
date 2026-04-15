import prisma from '../config/database';
import type { Quote } from '@prisma/client';
import type { CreateQuoteDTO, UpdateQuoteDTO } from '../types';

export const quoteRepository = {
  /**
   * Find quote by ID
   */
  findById: async (id: string) => {
    return prisma.quote.findUnique({
      where: { id },
      include: {
        ticket: {
          include: {
            customer: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Find quotes by ticket ID
   */
  findByTicketId: async (ticketId: string) => {
    return prisma.quote.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  /**
   * Create new quote
   */
  create: async (data: CreateQuoteDTO): Promise<Quote> => {
    return prisma.quote.create({
      data,
      include: {
        ticket: {
          include: {
            customer: true,
          },
        },
      },
    });
  },

  /**
   * Update quote
   */
  update: async (id: string, data: UpdateQuoteDTO): Promise<Quote> => {
    const updateData: Record<string, unknown> = { ...data };

    if (data.status === 'APPROVED' && !data.approvedAt) {
      updateData.approvedAt = new Date();
    }

    return prisma.quote.update({
      where: { id },
      data: updateData,
    });
  },

  /**
   * Delete quote
   */
  delete: async (id: string): Promise<Quote> => {
    return prisma.quote.delete({
      where: { id },
    });
  },

  /**
   * List quotes with filters
   */
  list: async (options: {
    page: number;
    limit: number;
    status?: string;
    ticketId?: string;
  }) => {
    const { page, limit, status, ticketId } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (ticketId) {
      where.ticketId = ticketId;
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ticket: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.quote.count({ where }),
    ]);

    return {
      data: quotes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get quote statistics
   */
  getStats: async () => {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.quote.count(),
      prisma.quote.count({ where: { status: 'PENDING' } }),
      prisma.quote.count({ where: { status: 'APPROVED' } }),
      prisma.quote.count({ where: { status: 'REJECTED' } }),
    ]);

    // Calculate total value of approved quotes
    const approvedQuotes = await prisma.quote.findMany({
      where: { status: 'APPROVED' },
      select: { price: true },
    });

    const totalValue = approvedQuotes.reduce((acc, quote) => acc + Number(quote.price), 0);

    return {
      total,
      pending,
      approved,
      rejected,
      totalValue,
    };
  },

  /**
   * Get quotes pending approval
   */
  getPendingQuotes: async () => {
    return prisma.quote.findMany({
      where: { status: 'PENDING' },
      include: {
        ticket: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  },
};

export default quoteRepository;
