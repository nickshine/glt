#! /usr/bin/env node

const program = require('commander');
const { version } = require('../package.json');
const logger = require('./lib/logger');
const { validateCommand } = require('./lib/validate');

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
  })
  .on('command:*', validateCommand)
  .parse(process.argv);
