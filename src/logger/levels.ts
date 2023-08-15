import chalk from 'chalk';

export const defaultLevels = [
  'debug',
  'verbose',
  'info',
  'warn',
  'error',
] as const;

export const levelColors = {
  debug: chalk.gray,
  verbose: chalk.black,
  info: chalk.cyan,
  warn: chalk.yellow,
  error: chalk.red,
};
