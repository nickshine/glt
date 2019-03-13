#!/usr/bin/env node

const program = require('commander');

program
  .option('-i, --pipeline-id <id>', 'cancel pipelines before pipeline id <id>', process.env.CI_PROJECT_ID)
  .parse(process.argv);
