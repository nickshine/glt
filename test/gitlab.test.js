const test = require('tape-async');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const setup = () => {
  const pipelinesStub = {
    all: sinon.stub(),
    cancel: sinon.stub(),
  };

  function MockProjectsBundle() {
    this.Pipelines = pipelinesStub;
  }

  const bundleStub = { ProjectsBundle: MockProjectsBundle };

  const gitlab = proxyquire('../src/service/gitlab', { 'gitlab/dist/es5': bundleStub });

  const fixtures = {
    pipelinesStub,
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
