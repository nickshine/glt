const test = require('tape-async');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const setup = () => {

  const pipelinesStub = {
    all: sinon.stub(),
    cancel: sinon.stub(),
  };

  const deploymentsStub = {
    all: sinon.stub(),
  };

  const environmentsStub = {
    all: sinon.stub(),
    remove: sinon.stub(),
    stop: sinon.stub(),
  };

  function MockProjectsBundle() {
    this.Pipelines = pipelinesStub;
    this.Deployments = deploymentsStub;
    this.Environments = environmentsStub;
  }

  const bundleStub = { ProjectsBundle: MockProjectsBundle };

  const gitlab = proxyquire('../src/service/gitlab', { 'gitlab/dist/es5': bundleStub });

  const fixtures = {
    pipelinesStub,
    deploymentsStub,
    environmentsStub,
    gitlab,
  };

  return fixtures;
};

const teardown = () => {
  sinon.restore();
};

test('cancelPipelines - no running pipelines', async (assert) => {
  assert.plan(2);

  const { gitlab, pipelinesStub } = setup();
  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
    ref: 'fake-ref',
    // pipelineId: 'fake-pipelineId',
  };


  pipelinesStub.all.returns([]);

  await gitlab.cancelPipelines(optionsStub);

  teardown();

  assert.ok(pipelinesStub.all.calledOnce, 'Pipelines API - GET all - called once as expected');
  assert.ok(pipelinesStub.cancel.notCalled, 'Pipelines API - cancel - not called as expected');
});

test('cancelPipelines - with running pipelines, no pipelineId', async (assert) => {
  assert.plan(2);

  const { gitlab, pipelinesStub } = setup();
  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
    ref: 'fake-ref',
    // pipelineId: 'fake-pipelineId',
  };

  pipelinesStub.all.returns(['one', 'two', 'three']);

  await gitlab.cancelPipelines(optionsStub);

  teardown();

  assert.ok(pipelinesStub.all.calledOnce, 'Pipelines API - GET all - called once as expected');
  assert.ok(pipelinesStub.cancel.calledThrice, 'Pipelines API - cancel -  called as expected');
});

test('cancelPipelines - with running pipelines + pipelineId', async (assert) => {
  assert.plan(2);

  const { gitlab, pipelinesStub } = setup();
  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
    ref: 'fake-ref',
    pipelineId: '3',
  };

  pipelinesStub.all.returns([{ id: 1 }, { id: 2 }, { id: 4 }]);

  await gitlab.cancelPipelines(optionsStub);

  teardown();

  assert.ok(pipelinesStub.all.calledOnce, 'Pipelines API - GET all - called once as expected');
  assert.ok(pipelinesStub.cancel.calledTwice, 'Pipelines API - cancel - called twice as expected');
});

test('cancelPipelines - thrown error', async (assert) => {
  assert.plan(3);

  const { gitlab, pipelinesStub } = setup();
  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
    ref: 'fake-ref',
  };

  pipelinesStub.all.throws();

  assert.doesNotThrow(() => gitlab.cancelPipelines(optionsStub));
  teardown();
  assert.ok(pipelinesStub.all.calledOnce, 'Pipelines API - GET all - called once as expected');
  assert.ok(pipelinesStub.cancel.notCalled, 'Pipelines API - cancel - not called');
});

test('cleanEnvironments - no empty environments', async (assert) => {
  assert.plan(3);

  const { gitlab, deploymentsStub, environmentsStub } = setup();
  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
  };


  deploymentsStub.all.returns([]);
  environmentsStub.all.returns([]);

  await gitlab.cleanEnvironments(optionsStub);

  teardown();

  assert.ok(deploymentsStub.all.calledOnce, 'Deployment API - GET all - called once as expected');
  assert.ok(environmentsStub.all.calledOnce, 'Environments API - GET all - called once as expected');
  assert.ok(environmentsStub.remove.notCalled, 'Environments API - remove - not called as expected');
});

test('cleanEnvironments - with empty and non-empty environments', async (assert) => {
  assert.plan(3);

  const { gitlab, deploymentsStub, environmentsStub } = setup();
  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
  };


  const envStub1 = {
    id: 1,
  };
  const envStub2 = {
    id: 2,
  };

  deploymentsStub.all.returns([
    {
      environment: envStub1,
    },
  ]);
  environmentsStub.all.returns([envStub1, envStub2]);

  await gitlab.cleanEnvironments(optionsStub);

  teardown();

  assert.ok(deploymentsStub.all.calledOnce, 'Deployment API - GET all - called once as expected');
  assert.ok(environmentsStub.all.calledOnce, 'Environments API - GET all - called once as expected');
  assert.ok(environmentsStub.remove.calledOnce, 'Environments API - remove - called once as expected');
});

test('cleanEnvironments - thrown error', async (assert) => {
  assert.plan(4);

  const { gitlab, deploymentsStub, environmentsStub } = setup();
  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
  };

  deploymentsStub.all.throws();

  assert.doesNotThrow(() => gitlab.cleanEnvironments(optionsStub));
  teardown();
  assert.ok(deploymentsStub.all.calledOnce, 'Deployments API - GET all - called once as expected');
  assert.ok(environmentsStub.all.calledOnce, 'Environments API - GET all - called once as expected');
  assert.ok(environmentsStub.remove.notCalled, 'Environments API - remove - not called as expected');
});

test('stopEnvironments - no old environments', async (assert) => {
  assert.plan(2);

  const { gitlab, deploymentsStub, environmentsStub } = setup();
  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
    age: '1h',
  };


  deploymentsStub.all.returns([]);

  await gitlab.stopEnvironments(optionsStub);

  teardown();

  assert.ok(deploymentsStub.all.calledOnce, 'Deployment API - GET all - called once as expected');
  assert.ok(environmentsStub.stop.notCalled, 'Environments API - stop - not called as expected');
});

test('stopEnvironments - with old environments', async (assert) => {
  assert.plan(2);

  const { gitlab, deploymentsStub, environmentsStub } = setup();

  // replaces Date object with timestamp 1 hour + 1ms > 0 epoch
  sinon.useFakeTimers(60 * 60 * 1000 + 1);

  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
    age: '1h',
  };

  deploymentsStub.all.returns([
    {

      created_at: '1970-01-01T00:00:00.000Z', // 0 epoch time, should be > 1h old for stub
      environment: {
        id: 1,
      },
    },
    {
      created_at: '2017-08-11T07:36:40.222Z',
      environment: {
        id: 2,
      },
    },
  ]);

  await gitlab.stopEnvironments(optionsStub);

  teardown();

  assert.ok(deploymentsStub.all.calledOnce, 'Deployment API - GET all - called once as expected');
  assert.ok(environmentsStub.stop.calledOnce, 'Environments API - stop - called once as expected');
});

test('stopEnvironments - env with active and old environments should not be stopped', async (assert) => {
  assert.plan(2);

  const { gitlab, deploymentsStub, environmentsStub } = setup();

  // replaces Date object with timestamp 1 hour + 1ms > 0 epoch
  sinon.useFakeTimers(60 * 60 * 1000 + 1);

  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
    age: '1h',
  };

  // one old, and one active env
  deploymentsStub.all.returns([
    {

      created_at: '1970-01-01T00:00:00.000Z', // 0 epoch time, should be > 1h old for stub
      environment: {
        id: 1,
      },
    },
    {
      created_at: '2017-08-11T07:36:40.222Z',
      environment: {
        id: 1,
      },
    },
  ]);

  await gitlab.stopEnvironments(optionsStub);

  teardown();

  assert.ok(deploymentsStub.all.calledOnce, 'Deployment API - GET all - called once as expected');
  assert.ok(environmentsStub.stop.notCalled, 'Environments API - stop - not called as expected');
});

test('Environments - thrown error', async (assert) => {
  assert.plan(3);

  const { gitlab, deploymentsStub, environmentsStub } = setup();
  const optionsStub = {
    url: 'fake-url',
    token: 'fake-token',
    projectId: 'fake-projectId',
    age: '1h',
  };

  deploymentsStub.all.throws();

  assert.doesNotThrow(() => gitlab.stopEnvironments(optionsStub));
  teardown();
  assert.ok(deploymentsStub.all.calledOnce, 'Deployments API - GET all - called once as expected');
  assert.ok(environmentsStub.stop.notCalled, 'Environments API - stop - not called as expected');
});
