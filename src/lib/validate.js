const logger = require('./logger');

const validateCommand = (commands, program) => {
  const cmd = commands[0];
  // eslint-disable-next-line no-underscore-dangle,eqeqeq
  if (!program.commands.find(c => c._name == cmd)) {
    logger.error(`Invalid command: ${program.args.join(' ')}`);
    process.exit(1);
  }
};
module.exports = {
  validateCommand,
};
