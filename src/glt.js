#! /usr/bin/env node

const program = require('commander');
const { version } = require('../package.json');
const logger = require('./logger');

function verbose() {
  logger.transports.find(t => t.name === 'console').level = 'debug';
}

program
  .version(version, '-V, --version')
  .description('A cli for GitLab tasks')
  .option('-t, --token <token>', 'GitLab Personal Access Token used to authenticate with the API (default: "$GITLAB_TOKEN || $CI_JOB_TOKEN")', process.env.GITLAB_TOKEN || process.env.CI_JOB_TOKEN)
  .option('-u, --url <url>', 'GitLab instance', process.env.GITLAB_URL || 'http://gitlab.com')
  .option('-p, --project-id <id>', 'GitLab project id (default: "$CI_PROJECT_ID")', process.env.CI_PROJECT_ID)
  .option('-b, --ref <ref>', 'only look at pipelines on branch <ref> (default: "$CI_COMMIT_REF_NAME")', process.env.CI_COMMIT_REF_NAME)
  .option('-v, --verbose', 'make the operation more talkative', verbose)
  .command('cancel', 'cancel pipelines')
  .parse(process.argv);

if (typeof program.token === 'undefined') {
  logger.error('A token is required. GITLAB_TOKEN, or CI_JOB_TOKEN should be set in environment. Override with --token flag.\n');
  program.help();
}
