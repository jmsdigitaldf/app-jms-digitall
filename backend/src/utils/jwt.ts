import jwt from 'jsonwebtoken';
import config from '../config';
import type { JwtPayload } from '../types';

export const jwtUtils = {
  /**
   * Generate access token
   */
  signAccessToken: (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  },

  /**
   * Generate refresh token
   */
  signRefreshToken: (payload: Pick<JwtPayload, 'userId'>): string => {
    return jwt.sign({ userId: payload.userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
  },

  /**
   * Verify access token
   */
  verifyAccessToken: (token: string): JwtPayload => {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  },

  /**
   * Verify refresh token
   */
  verifyRefreshToken: (token: string): Pick<JwtPayload, 'userId'> => {
    return jwt.verify(token, config.jwt.refreshSecret) as Pick<JwtPayload, 'userId'>;
  },

  /**
   * Decode token without verification (use with caution)
   */
  decode: (token: string): JwtPayload | null => {
    return jwt.decode(token) as JwtPayload | null;
  },
};

export default jwtUtils;
