import prisma from '../config/database';
import type { Ticket, TicketStatusHistory } from '@prisma/client';
import type { CreateTicketDTO, UpdateTicketDTO, TicketFilter } from '../types';

export const ticketRepository = {
  /**
   * Generate unique protocol number
   */
  generateProtocol: async (): Promise<string> => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    const count = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1),
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `${month}${year}-${sequence}`;
  },

  /**
   * Find ticket by ID
   */
  findById: async (id: string) => {
    return prisma.ticket.findUnique({
      where: { id },
      include: {
        customer: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        quotes: {
          orderBy: { createdAt: 'desc' },
        },
        statusHistory: {
          orderBy: { changedAt: 'desc' },
        },
      },
    });
  },

  /**
   * Find ticket by protocol
   */
  findByProtocol: async (protocol: string) => {
    return prisma.ticket.findUnique({
      where: { protocol },
      include: {
        customer: true,
        assignedTo: true,
        quotes: true,
      },
    });
  },

  /**
   * Create new ticket
   */
  create: async (data: CreateTicketDTO): Promise<Ticket> => {
    const protocol = await this.generateProtocol();

    return prisma.ticket.create({
      data: {
        ...data,
        protocol,
      },
      include: {
        customer: true,
      },
    });
  },

  /**
   * Update ticket
   */
  update: async (id: string, data: UpdateTicketDTO): Promise<Ticket> => {
    return prisma.ticket.update({
      where: { id },
      data,
    });
  },

  /**
   * Update ticket status with history
   */
  updateStatus: async (
    ticketId: string,
    status: string,
    reason?: string
  ): Promise<Ticket> => {
    const [ticket] = await prisma.$transaction([
      prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status,
          completedAt: status === 'COMPLETED' ? new Date() : null,
        },
      }),
      prisma.ticketStatusHistory.create({
        data: {
          ticketId,
          status,
          reason,
        },
      }),
    ]);

    return ticket;
  },

  /**
   * List tickets with filters and pagination
   */
  list: async (options: {
    page: number;
    limit: number;
    filters?: TicketFilter;
  }) => {
    const { page, limit, filters } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters) {
      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.priority) {
        where.priority = filters.priority;
      }

      if (filters.problemType) {
        where.problemType = filters.problemType;
      }

      if (filters.assignedToId) {
        where.assignedToId = filters.assignedToId;
      }

      if (filters.customerId) {
        where.customerId = filters.customerId;
      }

      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) {
          where.createdAt.gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          where.createdAt.lte = new Date(filters.dateTo);
        }
      }

      if (filters.search) {
        const searchFilter = filters.search;
        // Find customer IDs matching search
        const customers = await prisma.customer.findMany({
          where: {
            OR: [
              { name: { contains: searchFilter, mode: 'insensitive' } },
              { phone: { contains: searchFilter, mode: 'insensitive' } },
            ],
          },
          select: { id: true },
        });

        where.customerId = { in: customers.map(c => c.id) };
      }
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          quotes: {
            select: {
              id: true,
              price: true,
              status: true,
            },
          },
          _count: {
            select: { quotes: true },
          },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    return {
      data: tickets,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const [
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      todayCount,
      thisWeekCount,
      thisMonthCount,
    ] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: 'PENDING' } }),
      prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.ticket.count({ where: { status: 'COMPLETED' } }),
      prisma.ticket.count({ where: { status: 'CANCELLED' } }),
      prisma.ticket.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.ticket.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
      prisma.ticket.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      }),
    ]);

    // Calculate revenue from completed tickets
    const completedTickets = await prisma.ticket.findMany({
      where: { status: 'COMPLETED' },
      include: {
        quotes: {
          where: { status: 'APPROVED' },
          select: { price: true },
        },
      },
    });

    const revenue = completedTickets.reduce((acc, ticket) => {
      return acc + ticket.quotes.reduce((sum, quote) => sum + Number(quote.price), 0);
    }, 0);

    return {
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      today: todayCount,
      thisWeek: thisWeekCount,
      thisMonth: thisMonthCount,
      revenue,
    };
  },

  /**
   * Get status history for a ticket
   */
  getStatusHistory: async (ticketId: string): Promise<TicketStatusHistory[]> => {
    return prisma.ticketStatusHistory.findMany({
      where: { ticketId },
      orderBy: { changedAt: 'desc' },
    });
  },
};

export default ticketRepository;
