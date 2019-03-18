#!/usr/bin/env node

const program = require('commander');
const gitlab = require('./service/gitlab');
const logger = require('./lib/logger');
const { resolveCIDefaults } = require('./lib/validate');
const addCommonOptions = require('./lib/common-options');

addCommonOptions(program);

program
  .description('cancel pipelines')
  .option('-p, --project-id <id>', "GitLab project id (default: '$CI_PROJECT_ID')")
  .option('-i, --pipeline-id <id>', "cancel pipelines before pipeline id <id> (default: '$CI_PROJECT_ID')")
  .option('-b, --ref <ref>', "only look at pipelines on branch <ref> (default: '$CI_COMMIT_REF_NAME' || 'master')")
  .on('command:*', resolveCIDefaults)
  .parse(process.argv);

(async () => {
  try {
    logger.info('cancel fired');
    // await gitlab.cancelPipelines(program);
  } catch (e) {
    logger.error(e);
  }
})();
