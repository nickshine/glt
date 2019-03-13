#! /usr/bin/env node

const program = require('commander');
const { version } = require('../package.json');

program
  .version(version, '-v, --version')
  .description('GitLab CI cli for controlling active pipelines.')
  .option('-u, --url <url>', 'GitLab instance', process.env.GITLAB_URL || 'http://gitlab.com')
  .option('-p, --project-id <id>', 'GitLab project id (default: "$CI_PROJECT_ID")', process.env.CI_PROJECT_ID)
  .option('-b, --ref [ref]', 'only look at pipelines on branch <ref> (default: "$CI_COMMIT_REF_NAME")', process.env.CI_COMMIT_REF_NAME)
  .command('cancel', 'cancel pipelines')
  .parse(process.argv);
