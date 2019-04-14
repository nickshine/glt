const logger = require('./logger');

const validateAge = (age) => {
  const result = /^\d+h|d|w$/.test(age);
  logger.debug(`Age string valid? ${result}`);

  if (!result) {
    throw new Error(`Invalid age '${age}'. Enter numbers followed by an 'h' (hour), 'd' (day), or 'w' (week)`);
  }

  return age; // pass through for commander coercion
};

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
  validateAge,
};
