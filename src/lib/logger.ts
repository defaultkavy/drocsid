const DEFAULT_DATE_TIME_FORMAT = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
export interface LoggerConfig {
  dateTimeFormat: Intl.DateTimeFormat;
  prefix: any[];
  print: boolean;
}

export class Logger {
  config: LoggerConfig;
  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      dateTimeFormat: config?.dateTimeFormat ?? DEFAULT_DATE_TIME_FORMAT,
      prefix: config?.prefix ?? [],
      print: config?.print ?? true
    };
  }

  info(...args: any[]) {
    if (this.config.print) console.info(`${this.date()} [INFO]`, ...this.config.prefix, ...args)
  }
  debug(...args: any[]) {
    if (this.config.print) console.debug(`${this.date()} [DEBUG]`, ...this.config.prefix, ...args)
  }
  error(...args: any[]) {
    if (this.config.print) console.error(`${this.date()} [ERROR]`, ...this.config.prefix, ...args)
  }
  fatal(...args: any[]) {
    if (this.config.print) console.error(`${this.date()} [FATAL]`, ...this.config.prefix, ...args)
  }

  prefix(...args: any[]) {
    return new Logger({
      ...this.config,
      prefix: args
    })
  }

  private date(date = new Date()) {
    return this.config.dateTimeFormat.format(date)
  }
}