#!/usr/bin/env node

const program = require('commander');
const { validateCommand } = require('./lib/validate');

program
  .description('perform GitLab CI tasks')
  .command('cancel', 'cancel pipelines')
  .on('command:*', validateCommand)
  .parse(process.argv);
