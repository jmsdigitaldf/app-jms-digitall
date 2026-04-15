import pino from 'pino';
import config from '../config';

const level = config.env === 'development' ? 'debug' : 'info';

export const logger = pino({
  level,
  transport: config.env === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
  base: {
    env: config.env,
  },
});

export default logger;
