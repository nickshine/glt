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

const resolveUrl = () => {
  if (!program.url) {
    logger.debug("'--url' flag not provided, falling back to GITLAB_URL env var.");
    program.url = process.env.GITLAB_URL;
    if (!program.url) {
      logger.debug('GITLAB_URL env var note set, falling back to https://gitlab.com.');
      program.url = 'https://gitlab.com';
    }
  }
};

const resolveToken = () => {
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

const resolveProjectId = () => {
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

const resolveRef = () => {
  if (!program.ref) {
    logger.debug("'--ref' flag not provided, falling back to CI_COMMIT_REF_NAME env var.");
    program.ref = process.env.CI_COMMIT_REF_NAME;
    if (!program.ref) {
      logger.debug("CI_COMMIT_REF_NAME env var not set, defaulting to 'master' branch.");
      program.ref = 'master';
    }
  }
};

const resolvePipelineId = () => {
  if (!program.pipelineId) {
    logger.debug("'--pipeline-id' flag not provided, falling back to CI_PIPELINE_ID env var.");
    program.pipelineId = process.env.CI_PIPELINE_ID;
    if (!program.pipelineId) {
      logger.debug('CI_PIPELINE_ID env var not set, using latest pipeline id.');
    }
  }
};

const resolveCIDefaults = () => {
  resolveUrl();
  resolveToken();
  resolveProjectId();
  resolveRef();
  resolvePipelineId();
};

module.exports = {
  validateCommand,
  resolveCIDefaults,
};
