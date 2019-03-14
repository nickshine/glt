#!/usr/bin/env node

const program = require('commander');
const gitlab = require('./service/gitlab');
const logger = require('./logger');

program
  .option('-i, --pipeline-id <id>', 'cancel pipelines before pipeline id <id>', process.env.CI_PROJECT_ID)
  .parse(process.argv);

(async () => {
  try {
    await gitlab.cancelPipelines(program);
  } catch (e) {
    logger.error(e);
  }
})();
