const { ProjectsBundle } = require('gitlab/dist/es5');
const logger = require('../lib/logger');

const init = ({ url, token }) => new ProjectsBundle({ url, token });

const filterPipelines = (pipelines, pid) => pipelines.map(p => p.id).filter(id => id < pid);

const filterEmptyEnvironments = (
  environments,
  deploymentEnvIds,
) => environments.filter(e => !deploymentEnvIds.includes(e.id));

const getDeployments = async ({ api, projectId }) => {
  const deployments = await api.Deployments.all(projectId);

  logger.info(`${deployments.length} deployments found.`);
  logger.debug(`Existing deployments: ${JSON.stringify(deployments, null, 2)}`);
  return deployments;
};

const getEnvironments = async ({ api, projectId }) => {
  const environments = await api.Environments.all(projectId);

  logger.info(`${environments.length} environments found.`);
  logger.debug(`Existing environments: ${JSON.stringify(environments, null, 2)}`);
  return environments;
};

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

const cleanEnvironments = async ({ url, token, projectId }) => {
  const api = init({ url, token });

  try {
    const apiPromises = [];
    apiPromises.push(getDeployments({ api, projectId }));
    apiPromises.push(getEnvironments({ api, projectId }));
    const [deployments, environments] = await Promise.all(apiPromises);

    const deploymentEnvIds = deployments.map(d => d.environment.id);
    logger.debug(`Deployment env ids: ${JSON.stringify(deploymentEnvIds)}`);

    const emptyEnvironments = filterEmptyEnvironments(environments, deploymentEnvIds);
    logger.debug((`${emptyEnvironments.length} empty environments found.`));

    const environmentPromises = [];
    emptyEnvironments.forEach((e) => {
      logger.debug(`Deleting empty environment '${e.id}'`);
      const responsePromise = api.Environments.remove(projectId, e.id);
      environmentPromises.push(responsePromise);
    });
    const responses = await Promise.all(environmentPromises);
    logger.info(`${responses.length} empty environments deleted.`);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  cancelPipelines,
  cleanEnvironments,
};
