#! /usr/bin/env node

const program = require('commander');
const { version } = require('../package.json');
const logger = require('./logger');

program
  .version(version, '-V, --version')
  .description('A cli for GitLab tasks')
  .option('-u, --url <url>', 'GitLab instance', process.env.GITLAB_URL || 'http://gitlab.com')
  .option('-t, --token <token>', 'GitLab Personal Access Token used to authenticate with the API (default: "$GITLAB_TOKEN || $CI_JOB_TOKEN")')
  .option('-p, --project-id <id>', 'GitLab project id (default: "$CI_PROJECT_ID")')
  .option('-v, --verbose', 'make the operation more talkative')
  .command('ci', 'perform GitLab CI tasks')
  .on('option:verbose', () => {
    logger.transports.find(t => t.name === 'console').level = 'debug';
    logger.debug('Verbose output enabled.');
  })
  .on('command:*', function (command) {
    const cmd = command[0];
    // eslint-disable-next-line no-underscore-dangle,eqeqeq
    if (!this.commands.find(c => c._name == cmd)) {
      logger.error(`Invalid command: ${this.args.join(' ')}\n-------------------`);
      program.help();
    }
  })
  .parse(process.argv);

if (!program.token) {
  logger.debug("'--token' flag not provided, falling back to GITLAB_TOKEN env var.");
  program.token = process.env.GITLAB_TOKEN;
  if (!program.token) {
    logger.debug('GITLAB_TOKEN env var not set, falling back to CI_JOB_TOKEN env var.');
    program.token = process.env.CI_JOB_TOKEN;
  }
  if (!program.token) {
    logger.error('CI_JOB_TOKEN env var not set. A token is required.');
    process.exit(1);
  }
} else if (!program.projectId) {
  logger.debug("'--project-id' flag not provided, falling back to CI_PROJECT_ID env var.");
  program.projectId = process.env.CI_PROJECT_ID;
  if (!program.projectId) {
    logger.debug('CI_PROJECT_ID env var not set. A project-id is required.');
    process.exit(1);
  }
}
