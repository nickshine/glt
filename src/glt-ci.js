#!/usr/bin/env node

const program = require('commander');
const gitlab = require('./service/gitlab');
const logger = require('./logger');

program
  .option('-i, --pipeline-id <id>', 'cancel pipelines before pipeline id <id>', process.env.CI_PROJECT_ID)
  .option('-b, --ref <ref>', 'only look at pipelines on branch <ref> (default: "$CI_COMMIT_REF_NAME")', process.env.CI_COMMIT_REF_NAME)
  .arguments('<task>')
  .parse(process.argv);

logger.info(`args: ${program.args}`);
logger.info(program.args[0]);


(async () => {
  try {
    switch (program.args) {
      case 'cancel':
        logger.info('glt ci cancel');
        await gitlab.cancelPipelines(program);
        break;
      default:
        logger.error('unrecognized ci task');
        program.help();
    }
  } catch (e) {
    logger.error(e);
  }
})();
