#!/usr/bin/env node

const program = require('commander');
const gitlab = require('./service/gitlab');
const logger = require('./logger');

program
  .description('cancel pipelines')
  .parse(process.argv);

(async () => {
  try {
    await gitlab.cancelPipelines(program);
  } catch (e) {
    logger.error(e);
  }
})();
