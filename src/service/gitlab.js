const { ProjectsBundle } = require('gitlab/dist/es5');
const logger = require('../logger');

let api;

const init = ({ url, token }) => {
  api = new ProjectsBundle({ url, token });
};

const filterPipelines = (pipelines, pid) => pipelines.map(p => p.id).filter(id => id < pid);

const getPipelines = async ({ projectId, ref, pipelineId }) => {
  const pipelines = await api.Pipelines.all(projectId, { ref, scope: 'running' });
  logger.debug(`All running pipelines on branch '${ref}' for project id '${projectId}': ${pipelines}`);
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
  const pipelines = await getPipelines({ projectId, ref, pipelineId });
  logger.debug(`All running pipelines on branch '${ref}' older than pipeline id '${pipelineId}': ${pipelines}`);
  logger.info(pipelines);
};

module.exports = {
  cancelPipelines,
};
