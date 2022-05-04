import { gray, blue, yellow, red } from 'https://deno.land/std@0.137.0/fmt/colors.ts';

const levelColors = new Map<string, (str: string) => string>();
levelColors.set('debug', gray);
levelColors.set('info', blue);
levelColors.set('warn', yellow);
levelColors.set('error', red);

const noColor: (str: string) => string = (msg) => msg;
/**
 * A light logger that has multiple log levels.
 * 
 * Initialize with `const log = logger();`
*/
export default function logger({
  name,
  logLevel = 'info',
  timestamp = true
}: {
  name?: string,
  logLevel?: 'debug' | 'info' | 'warn' | 'error',
  timestamp?: boolean
} = {}) {
  /**
   * @param {'debug' | 'info' | 'warn' | 'error'} level 
   * The log level, any level below the main `logLevel` won't be printed.
   * 
   * This function also takes in arguments after the level to print,
   * just like `console.log()`.
  */
  // deno-lint-ignore no-explicit-any
  function log(level: 'debug' | 'info' | 'warn' | 'error', ...args: any[]) {
    if (level < logLevel) return;

    let color = levelColors.get(level);
    if (!color) color = noColor;

    const date = new Date();

    let log: string[] = [];
    if (timestamp) {
      log = [
        `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`,
        color(level),
        name ? `${name} >` : ">",
        ...args
      ];
    } else {
      log = [
        color(level),
        name ? `${name} >` : ">",
        ...args
      ];
    }

    switch (level) {
      case 'debug':
        return console.debug(...log);
      case 'info':
        return console.info(...log);
      case 'warn':
        return console.warn(...log);
      case 'error':
        return console.error(...log);
      default:
        return console.log(...log);
    }
  }

  /**
   * Sets this logger instance's `logLevel`.
  */
  function setLevel(level: 'debug' | 'info' | 'warn' | 'error') {
    logLevel = level;
  }

  /**
   * Alias to `logger.log('debug', ...args: any[])`.
  */
  // deno-lint-ignore no-explicit-any
  function debug(...args: any[]) {
    log('debug', ...args);
  }

  /**
   * Alias to `logger.log('info', ...args: any[])`.
  */
  // deno-lint-ignore no-explicit-any
  function info(...args: any[]) {
    log('info', ...args);
  }

  /**
   * Alias to `logger.log('warn', ...args: any[])`.
  */
  // deno-lint-ignore no-explicit-any
  function warn(...args: any[]) {
    log('warn', ...args);
  }

  /**
   * Alias to `logger.log('error', ...args: any[])`.
  */
  // deno-lint-ignore no-explicit-any
  function error(...args: any[]) {
    log('error', ...args);
  }

  return {
    log,
    setLevel,
    debug,
    info,
    warn,
    error,
  };
}

export const log = logger();
