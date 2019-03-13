#! /usr/bin/env node

const program = require('commander');
const { version } = require('../package.json');

program
  .version(version, '-v, --version')
  .description('GitLab CI cli for controlling active pipelines.')
  .parse(process.argv);
