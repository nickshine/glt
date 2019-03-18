const { createLogger, format, transports } = require('winston');

const consoleTransport = new transports.Console({ level: 'info' });

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.splat(),
    format.simple(),
  ),
  transports: [
    consoleTransport,
  ],
});

module.exports = logger;
