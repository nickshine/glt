#!/usr/bin/env node

const program = require('commander');
const { validateCommand } = require('./lib/validate');

program
  .description('perform tasks on GitLab Environments')
  .command('clean', 'clean environments')
  .on('command:*', commands => validateCommand(commands, program))
  .parse(process.argv);
