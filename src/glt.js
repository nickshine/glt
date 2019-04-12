#! /usr/bin/env node

const program = require('commander');
const { version } = require('../package.json');
const { validateCommand } = require('./lib/validate');

program
  .version(version, '-V, --version')
  .description('A cli for GitLab tasks')
  .command('ci', 'perform GitLab CI tasks')
  .command('env', 'perform tasks on GitLab environments')
  .on('command:*', commands => validateCommand(commands, program))
  .parse(process.argv);
