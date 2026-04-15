import prisma from '../config/database';
import type { Customer } from '@prisma/client';
import type { CreateCustomerDTO, UpdateCustomerDTO } from '../types';

export const customerRepository = {
  /**
   * Find customer by phone
   */
  findByPhone: async (phone: string): Promise<Customer | null> => {
    return prisma.customer.findUnique({
      where: { phone },
    });
  },

  /**
   * Find customer by ID
   */
  findById: async (id: string): Promise<Customer | null> => {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { tickets: true },
        },
      },
    });
  },

  /**
   * Create new customer
   */
  create: async (data: CreateCustomerDTO): Promise<Customer> => {
    return prisma.customer.create({
      data,
    });
  },

  /**
   * Update customer
   */
  update: async (id: string, data: UpdateCustomerDTO): Promise<Customer> => {
    return prisma.customer.update({
      where: { id },
      data,
    });
  },

  /**
   * Find or create customer by phone
   */
  findOrCreate: async (phone: string, defaults: Partial<CreateCustomerDTO>): Promise<Customer> => {
    const existing = await this.findByPhone(phone);
    
    if (existing) {
      return existing;
    }

    return this.create({
      phone,
      name: defaults.name || 'Cliente WhatsApp',
      email: defaults.email,
      document: defaults.document,
      address: defaults.address,
      city: defaults.city,
      state: defaults.state,
      zipCode: defaults.zipCode,
      notes: defaults.notes,
    });
  },

  /**
   * List customers with pagination and filters
   */
  list: async (options: {
    page: number;
    limit: number;
    isActive?: boolean;
    search?: string;
  }) => {
    const { page, limit, isActive, search } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { tickets: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get customer statistics
   */
  getStats: async () => {
    const [total, active, withTickets] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { isActive: true } }),
      prisma.customer.count({
        where: {
          tickets: {
            some: {},
          },
        },
      }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      withTickets,
    };
  },
};

export default customerRepository;
