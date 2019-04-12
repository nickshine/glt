const test = require('tape-async');
const sinon = require('sinon');
const { resolveCIDefaults, resolveEnvDefaults } = require('../src/lib/resolver');

const setup = () => {
  const programStub = {};

  const fixtures = {
    programStub,
    processStub: sinon.stub(process, 'exit'),
  };

  return fixtures;
};

const teardown = () => {
  sinon.restore();
};

test('resolveCIDefaults - no flags, no env vars', (assert) => {
  assert.plan(4);

  const { programStub } = setup();
  sinon.stub(process, 'env').value({});

  resolveCIDefaults(programStub);

  teardown();
  assert.equal(programStub.url, 'https://gitlab.com', 'Default URL applied');
  assert.notOk(programStub.token, 'Token not set as expected');
  assert.notOk(programStub.projectId, 'projectId not set as expected');
  assert.equal(programStub.ref, 'master', 'Default branch of master applied');
});

test('resolveCIDefaults - no flags, with env vars', (assert) => {
  assert.plan(5);

  const { programStub } = setup();

  sinon.stub(process, 'env').value({
    GITLAB_URL: 'fake-url',
    GITLAB_TOKEN: 'fake-token',
    CI_PROJECT_ID: 'fake-project-id',
    CI_COMMIT_REF_NAME: 'fake-ref',
    CI_PIPELINE_ID: 'fake-pipeline-id',
  });

  resolveCIDefaults(programStub);

  teardown();
  assert.equal(programStub.url, 'fake-url', 'Url set from env');
  assert.equal(programStub.token, 'fake-token', 'Token set from env');
  assert.equal(programStub.projectId, 'fake-project-id', 'Project ID set from env');
  assert.equal(programStub.ref, 'fake-ref', 'Ref set from env');
  assert.equal(programStub.pipelineId, 'fake-pipeline-id', 'Pipeline ID set from env');
});

test('resolveCIDefaults - no flags, with secondary env vars', async (assert) => {
  assert.plan(1);

  const { programStub } = setup();

  sinon.stub(process, 'env').value({
    CI_JOB_TOKEN: 'fake-job-token',
  });
  resolveCIDefaults(programStub);

  teardown();
  assert.equal(programStub.token, 'fake-job-token', 'Token set from secondary env var');
});

test('resolveCIDefaults - with flags', async (assert) => {
  assert.plan(5);

  const stub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-project-id',
    ref: 'fake-ref',
    pipelineId: 'fake-pipeline-id',
  };

  sinon.stub(process, 'env').value({
    GITLAB_URL: 'fake-env-url',
    GITLAB_TOKEN: 'fake--env-token',
    CI_PROJECT_ID: 'fake-env-project-id',
    CI_COMMIT_REF_NAME: 'fake-env-ref',
    CI_PIPELINE_ID: 'fake-env-pipeline-id',
  });

  resolveCIDefaults(stub);

  teardown();
  assert.equal(stub.url, 'fake-url', 'Url set from flag');
  assert.equal(stub.token, 'fake-token', 'Token set from flag');
  assert.equal(stub.projectId, 'fake-project-id', 'Project ID set from flag');
  assert.equal(stub.ref, 'fake-ref', 'Ref set from flag');
  assert.equal(stub.pipelineId, 'fake-pipeline-id', 'Pipeline ID set from flag');
});

test('resolveEnvDefaults', async (assert) => {
  assert.plan(2);

  const stub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-project-id',
  };

  resolveEnvDefaults(stub);

  assert.equal(stub.ref, undefined, 'resolveRef not called as expected');
  assert.equal(stub.pipelineId, undefined, 'resolvePipelineId not called called as expected');
});
