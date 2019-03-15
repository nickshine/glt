#!/usr/bin/env node

const program = require('commander');

program
  .description('perform GitLab CI tasks')
  .option('-i, --pipeline-id <id>', 'cancel pipelines before pipeline id <id>', process.env.CI_PROJECT_ID)
  .option('-b, --ref <ref>', 'only look at pipelines on branch <ref> (default: "$CI_COMMIT_REF_NAME")', process.env.CI_COMMIT_REF_NAME)
  .command('cancel', 'cancel pipelines')
  .parse(process.argv);
