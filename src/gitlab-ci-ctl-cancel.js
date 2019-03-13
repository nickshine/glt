#!/usr/bin/env node

const program = require('commander');

program
  .option('-p, --pipeline-id <id>', 'cancel active pipelines before pipeline id <id>', process.env.CI_PROJECT_ID)
  .parse(process.argv);
