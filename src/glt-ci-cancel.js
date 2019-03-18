#!/usr/bin/env node

const program = require('commander');
const gitlab = require('./service/gitlab');
const logger = require('./lib/logger');
const { validateCIOptions } = require('./lib/validate');
const addCommonOptions = require('./lib/common-options');

addCommonOptions(program);

program
  .description('cancel pipelines')
  .option('-p, --project-id <id>', 'GitLab project id (default: "$CI_PROJECT_ID")')
  .option('-i, --pipeline-id <id>', 'cancel pipelines before pipeline id <id>', process.env.CI_PROJECT_ID)
  .option('-b, --ref <ref>', 'only look at pipelines on branch <ref> (default: "$CI_COMMIT_REF_NAME" || "master")', process.env.CI_COMMIT_REF_NAME || 'master')
  .on('option:ref', () => {
    if (!process.env.CI_COMMIT_REF_NAME) {
      logger.info(process.env.CI_COMMIT_REF_NAME);
      logger.debug('CI_COMMIT_REF_NAME not found in environment. Defaulting branch to master.');
    }
  })
  .on('command:*', validateCIOptions)
  .parse(process.argv);

(async () => {
  try {
    logger.info('cancel fired');
    // await gitlab.cancelPipelines(program);
  } catch (e) {
    logger.error(e);
  }
})();
