import prisma from '../config/database';
import type { User, RefreshToken } from '@prisma/client';
import type { CreateUserDTO, UpdateUserDTO } from '../types';

export const userRepository = {
  /**
   * Find user by email
   */
  findByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Find user by ID
   */
  findById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Find user by ID with relations
   */
  findByIdWithRelations: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        tickets: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        quotes: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  /**
   * Create new user
   */
  create: async (data: CreateUserDTO): Promise<User> => {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || 'TECHNICIAN',
      },
    });
  },

  /**
   * Update user
   */
  update: async (id: string, data: UpdateUserDTO): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  /**
   * Update last login
   */
  updateLastLogin: async (id: string): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },

  /**
   * Delete user (soft delete by setting isActive to false)
   */
  softDelete: async (id: string): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  },

  /**
   * List users with pagination
   */
  list: async (options: {
    page: number;
    limit: number;
    isActive?: boolean;
    role?: string;
    search?: string;
  }) => {
    const { page, limit, isActive, role, search } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          avatarUrl: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Refresh token management
   */
  refreshToken: {
    create: async (userId: string, token: string, expiresAt: Date): Promise<RefreshToken> => {
      return prisma.refreshToken.create({
        data: { userId, token, expiresAt },
      });
    },

    findByToken: async (token: string): Promise<RefreshToken | null> => {
      return prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });
    },

    deleteByUserId: async (userId: string): Promise<void> => {
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    },

    deleteExpired: async (): Promise<number> => {
      const result = await prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
      return result.count;
    },
  },
};

export default userRepository;
