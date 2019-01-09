const { transports, createLogger, format } = require('winston');

const Logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  Logger.add(
    new transports.Console({
      format: format.simple()
    })
  );
}

module.exports = Logger;
