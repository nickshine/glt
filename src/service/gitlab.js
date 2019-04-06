const { ProjectsBundle } = require('gitlab/dist/es5');
const logger = require('../lib/logger');

const init = ({ url, token }) => new ProjectsBundle({ url, token });

const filterPipelines = (pipelines, pid) => pipelines.map(p => p.id).filter(id => id < pid);

const getPipelines = async ({
  api,
  projectId,
  ref,
  pipelineId,
}) => {
  const pipelines = await api.Pipelines.all(projectId, { ref, scope: 'running' });
  // const pipelines = await api.Pipelines.all(projectId, { ref });
  logger.info(`${pipelines.length} running pipelines found on branch '${ref}'.`);
  if (!pipelineId) {
    logger.debug('No pipeline id given, returning all running pipelines unfiltered.');
    return pipelines;
  }
  const filteredPipelines = filterPipelines(pipelines, pipelineId);
  logger.debug(`Previously running pipelines on branch '${ref}' for project id '${projectId}': ${JSON.stringify(filteredPipelines, null, 2)}`);
  return filteredPipelines;
};

const cancelPipelines = async ({
  url,
  token,
  projectId,
  ref,
  pipelineId,
}) => {
  const api = init({ url, token });

  let pipelines = [];
  try {
    pipelines = await getPipelines({
      api,
      projectId,
      ref,
      pipelineId,
    });
    const pipelinePromises = [];

    pipelines.forEach((p) => {
      logger.debug(`Cancelling pipeline '${p}'`);
      const responsePromise = api.Pipelines.cancel(projectId, p);
      pipelinePromises.push(responsePromise);
    });
    const responses = await Promise.all(pipelinePromises);
    logger.debug(`Cancelled pipelines: ${JSON.stringify(responses, null, 2)}`);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  cancelPipelines,
};
