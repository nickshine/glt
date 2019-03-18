#!/usr/bin/env node

const program = require('commander');
const gitlab = require('./service/gitlab');
const logger = require('./lib/logger');
const { validateOptions } = require('./lib/validate');

program
  .description('cancel pipelines')
  .on('command:*', validateOptions)
  .parse(process.argv);

(async () => {
  try {
    // await gitlab.cancelPipelines(program);
  } catch (e) {
    logger.error(e);
  }
})();
