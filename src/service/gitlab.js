const { ProjectsBundle } = require('gitlab/dist/es5');
const logger = require('../lib/logger');

let api;

const init = ({ url, token }) => {
  if (!api) {
    api = new ProjectsBundle({ url, token });
  }
};

const filterPipelines = (pipelines, pid) => pipelines.map(p => p.id).filter(id => id < pid);

const getPipelines = async ({ projectId, ref, pipelineId }) => {
  const pipelines = await api.Pipelines.all(projectId, { ref, scopes: ['running', 'pending'] });
  // const pipelines = await api.Pipelines.all(projectId, { ref });
  logger.debug(`All running pipelines on branch '${ref}' for project id '${projectId}': ${JSON.stringify(pipelines, null, 2)}`);
  return filterPipelines(pipelines, pipelineId);
};

const cancelPipelines = async ({
  url,
  token,
  projectId,
  ref,
  pipelineId,
}) => {
  init({ url, token });
  let pipelines = [];
  try {
    pipelines = await getPipelines({ projectId, ref, pipelineId });
    logger.info(`${pipelines.length} running pipelines found on branch '${ref}'.`);
    const pipelinePromises = [];

    pipelines.forEach((p) => {
      logger.debug(`Cancelling pipeline '${p}'`);
      const responsePromise = api.Pipelines.cancel(projectId, p);
      pipelinePromises.push(responsePromise);
    });
    const responses = await Promise.all(pipelinePromises);
    logger.debug(`Cancelled pipeline responses: ${JSON.stringify(responses, null, 2)}`);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  cancelPipelines,
};
