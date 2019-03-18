const program = require('commander');
const logger = require('./logger');

const validateCommand = (commands) => {
  const cmd = commands[0];
  // eslint-disable-next-line no-underscore-dangle,eqeqeq
  if (!program.commands.find(c => c._name == cmd)) {
    logger.error(`Invalid command: ${program.args.join(' ')}`);
    process.exit(1);
  }
};

const validateToken = () => {
  if (!program.token) {
    logger.debug("'--token' flag not provided, falling back to GITLAB_TOKEN env var.");
    program.token = process.env.GITLAB_TOKEN;
    if (!program.token) {
      logger.debug('GITLAB_TOKEN env var not set, falling back to CI_JOB_TOKEN env var.');
      program.token = process.env.CI_JOB_TOKEN;
      if (!program.token) {
        logger.debug('CI_JOB_TOKEN env var not set');
        logger.error('A token is required');
        process.exit(1);
      }
    }
  }
};

const validateProjectId = () => {
  if (!program.projectId) {
    logger.debug("'--project-id' flag not provided, falling back to CI_PROJECT_ID env var.");
    program.projectId = process.env.CI_PROJECT_ID;
    if (!program.projectId) {
      logger.debug('CI_PROJECT_ID env var not set');
      logger.error('A project id is required');
      process.exit(1);
    }
  }
};

const validateUrl = () => {
  if (!program.url) {
    logger.debug("'--url' flag not provided, falling back to GITLAB_URL env var.");
    program.url = process.env.GITLAB_URL;
    if (!program.url) {
      logger.debug('GITLAB_URL env var note set, falling back to http://gitlab.com');
      program.url = 'http://gitlab.com';
    }
  }
};

const validateCIOptions = () => {
  validateUrl();
  validateToken();
  validateProjectId();
};

module.exports = {
  validateCommand,
  validateCIOptions,
};
