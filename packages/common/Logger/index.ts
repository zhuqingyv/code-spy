enum LoggerTypeEnum {
  ERROR = 'error',
  LOG = 'log',
  WARN = 'warn'
};

interface LoggerType {
  type: LoggerTypeEnum;
  time: number;
  message: any;
};

interface LoggerManagerType {
  cache: LoggerType[];
  currentCache: LoggerType[];
  timer: any;
  add: (type: LoggerTypeEnum, message: any) => void;
  clearCache: () => void;
  log: (log: LoggerType) => any;
  output: (param:{ log: LoggerType, context: LoggerManagerType }) => any
}

const logger:LoggerManagerType = {
  cache:[],
  currentCache:[],
  timer: null,

  add(type,message) {
    this.currentCache.push({ type, message, time: Date.now() });
    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.currentCache.forEach((log) => {
        this.log(log);
      });
      this.clearCache();
    }, 1000);

  },

  clearCache() {
    this.timer = null;
    this.currentCache = [];
  },

  log(log) {
    const getConsoleHandle = () => {
      if (window?.console) return window.console;
      if (self?.console) return self.console;
      if (global?.console) return global.console;
      if (globalThis?.console) return globalThis.console;
      return {} as any;
    };

    const console = getConsoleHandle();
    const handle = console[log.type];

    if (handle) handle(log.message);
    if (this.output) this.output({ log, context: this });
    this.cache.push(log);
  },

  output() {}
};

export const warn = (message: any) => logger.add(LoggerTypeEnum.WARN, message);

export const error = (message: any) => logger.add(LoggerTypeEnum.ERROR, message);

export const log = (message: any) => logger.add(LoggerTypeEnum.LOG, message);

export default logger;