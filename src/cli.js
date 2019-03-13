#! /usr/bin/env node

const program = require('commander');
const { version } = require('../package.json');

program
  .version(version, '-v, --version')
  .description('GitLab CI cli for controlling active pipelines.')
  .command('cancel', 'cancel active pipelines in relation to a pipeline id')
  .parse(process.argv);
