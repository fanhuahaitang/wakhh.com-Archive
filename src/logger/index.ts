import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import moment from 'moment';
import path from 'path';

export default winston.createLogger({
  level: 'info',
  format: winston.format.printf(info => `${moment().format('YY-MM-DD HH:mm:ss')} [${info.level}] ${info.message}`),
  transports: [
    new DailyRotateFile({
      frequency: '6h',
      dirname: path.resolve('./log'),
      filename: '%DATE%.log',
      datePattern: 'YY-MM-DD-HH',
      maxSize: '70m',
      maxFiles: '14d'
    })
  ]
})