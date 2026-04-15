import bcrypt from 'bcrypt';
import { userRepository } from '../repositories';
import { jwtUtils } from '../utils';
import type { CreateUserDTO, LoginDTO, AuthResponse } from '../types';
import config from '../config';

const BCRYPT_ROUNDS = 12;

export const authService = {
  /**
   * Hash password
   */
  hashPassword: async (password: string): Promise<string> => {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  },

  /**
   * Compare password with hash
   */
  comparePassword: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },

  /**
   * Register new user
   */
  register: async (data: CreateUserDTO): Promise<AuthResponse> => {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    };
  },

  /**
   * Login user
   */
  login: async (data: LoginDTO): Promise<AuthResponse> => {
    // Find user by email
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Usuário inativo');
    }

    // Verify password
    const isValidPassword = await this.comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Email ou senha inválidos');
    }

    // Update last login
    await userRepository.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    };
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      // Verify refresh token
      const payload = jwtUtils.verifyRefreshToken(refreshToken);

      // Check if token exists in database
      const storedToken = await userRepository.refreshToken.findByToken(refreshToken);
      if (!storedToken) {
        throw new Error('Token inválido');
      }

      // Check if token is expired
      if (storedToken.expiresAt < new Date()) {
        await userRepository.refreshToken.deleteByUserId(storedToken.userId);
        throw new Error('Token expirado');
      }

      // Get user
      const user = await userRepository.findById(storedToken.userId);
      if (!user || !user.isActive) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      // Delete old refresh token
      await userRepository.refreshToken.deleteByUserId(user.id);

      // Generate new tokens
      return this.generateTokens(user.id, user.email, user.role);
    } catch (error) {
      throw new Error('Token de refresh inválido ou expirado');
    }
  },

  /**
   * Logout user (invalidate refresh tokens)
   */
  logout: async (userId: string): Promise<void> => {
    await userRepository.refreshToken.deleteByUserId(userId);
  },

  /**
   * Generate access and refresh tokens
   */
  generateTokens: async (
    userId: string,
    email: string,
    role: string
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const accessToken = jwtUtils.signAccessToken({ userId, email, role });
    const refreshToken = jwtUtils.signRefreshToken({ userId });

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    // Store refresh token
    await userRepository.refreshToken.create(userId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  /**
   * Validate access token
   */
  validateToken: async (token: string) => {
    try {
      const payload = jwtUtils.verifyAccessToken(token);
      
      // Check if user exists and is active
      const user = await userRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  },
};

export default authService;
