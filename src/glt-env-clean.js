#!/usr/bin/env node

const program = require('commander');
const gitlab = require('./service/gitlab');
const logger = require('./lib/logger');
const { resolveCIDefaults } = require('./lib/resolver');
const addCommonOptions = require('./lib/common-options');

addCommonOptions(program);

program
  .description('clean environments (delete environments with zero deployments)')
  .option('-p, --project-id <id>', "GitLab project id (default: '$CI_PROJECT_ID')")
  .on('command:*', () => resolveCIDefaults(program))
  .parse(process.argv);

(async () => {
  try {
    await gitlab.cleanEnvironments(program);
  } catch (e) {
    logger.error(e);
  }
})();
