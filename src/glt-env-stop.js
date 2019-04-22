#!/usr/bin/env node

const program = require('commander');
const gitlab = require('./service/gitlab');
const logger = require('./lib/logger');
const { resolveEnvDefaults } = require('./lib/resolver');
const addCommonOptions = require('./lib/common-options');
const { validateAge } = require('./lib/validate');

addCommonOptions(program);

program
  .description('stop environments with deployments older than a specified age')
  .option('-p, --project-id <id>', "GitLab project id (default: '$CI_PROJECT_ID')")
  .option('-a, --age <age>', 'stop environmments with deployments older than <age>', '1w')
  .on('command:*', () => resolveEnvDefaults(program))
  .parse(process.argv);

(async () => {
  try {
    validateAge(program.age);
    await gitlab.stopEnvironments(program);
  } catch (e) {
    logger.error(e);
  }
})();
