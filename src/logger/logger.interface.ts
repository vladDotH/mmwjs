import { MMWLogMeta } from './log-meta.interface';

export interface MMWLogger {
  error(message: string, meta?: MMWLogMeta);
  warn(message: string, meta?: MMWLogMeta);
  info?(message: string, meta?: MMWLogMeta);
  verbose?(message: string, meta?: MMWLogMeta);
  debug?(message: string, meta?: MMWLogMeta);
}
