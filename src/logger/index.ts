import winston from 'winston';
import { MMWLogger } from './logger.interface';
import { MMWLogMeta } from './log-meta.interface';
import { fromPairs } from 'lodash';
import { defaultFormat } from './format';
import { defaultLevels } from './levels';

const winstonLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    defaultFormat,
    winston.format.colorize(),
  ),
  transports: [new winston.transports.Console()],
});

let innerLogger = fromPairs(
  defaultLevels.map((level) => [
    level,
    (message: string, meta?: MMWLogMeta) =>
      winstonLogger[level]({ level, message, ...meta }),
  ]),
) as unknown as MMWLogger;

const proxyLogger = new Proxy(
  {},
  {
    get(target: never, p: string): any {
      return innerLogger[p];
    },
  },
) as MMWLogger;

export function setDefaultLogger(newLogger: MMWLogger) {
  innerLogger = newLogger;
}

export { proxyLogger as logger };
