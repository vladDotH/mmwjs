import { MMWLogMeta } from './log-meta.interface';
import winston from 'winston';
import process from 'process';

type LogType = {
  message: string;
  level: string;
  timestamp: string;
} & MMWLogMeta;

export const defaultFormat = winston.format.printf((info: LogType) => {
  return (
    `[${info.scope ?? `MMW - ${process.pid}`}] ` +
    `${info.timestamp} ` +
    `${info.level.toUpperCase().padEnd(7)} ` +
    `${info.message} ` +
    (info.tags ? `[${info.tags?.join(';') ?? ''}]` : '')
  );
});
