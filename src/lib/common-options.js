const logger = require('./logger');

module.exports = (command) => {
  command
    .option('-u, --url <url>', "GitLab instance (default: '$GITLAB_URL' || 'http://gitlab.com')")
    .option('-t, --token <token>', "GitLab Personal Access Token used to authenticate with the API (default: '$GITLAB_TOKEN'|| '$CI_JOB_TOKEN')")
    .option('-v, --verbose', 'make the operation more talkative')
    .on('option:verbose', () => {
      logger.transports.find(t => t.name === 'console').level = 'debug';
    });
};
