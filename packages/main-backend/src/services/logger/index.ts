import DailyRotateFile from "winston-daily-rotate-file";
import {
  createLogger,
  format,
  Logger,
  transports
} from "winston";
import { TransformableInfo } from "logform";
import { configuration } from "config";

const {
  timestamp,
  combine,
  printf,
  align
} = format;

const buildDevLogger = () : Logger => {
  const myFormat = printf(({
    level,
    message,
    timestamp
  } : TransformableInfo) => {
    return `[${ timestamp }] - [${ level }]: ${ message }`;
  });

  return createLogger({
    level : "debug",
    format : combine(format.colorize(), timestamp({ format : "YYYY-MM-DD HH:mm:ss" }), myFormat),
    //defaultMeta: { service: 'user-service' },
    transports : [new transports.Console()]
  });
};

const buildProdLogger = () : Logger => {
  const myFormat = printf(({
    level,
    message,
    timestamp
  } : TransformableInfo) => {
    return `[${ timestamp }] - [${ level }]: ${ message }`;
  });
  return createLogger({
    level : "info",
    // format: winston.format.simple(),
    format : combine(timestamp({ format : "YYYY-MM-DD HH:mm:ss" }), align(), myFormat),
    defaultMeta : { service : "MAIN_BACKEND" },
    transports : [
      new transports.Console(),
      new DailyRotateFile({
        filename : "error-%DATE%.log",
        dirname : "logs",
        datePattern : "YYYY-MM-DD-HH",
        zippedArchive : true,
        maxSize : "20m",
        maxFiles : "14d",
        level : "error",
        handleExceptions : true,
        handleRejections : true
      })
    ]
  });
};

export const logger : Logger = configuration.productionMode ? buildProdLogger() : buildDevLogger();