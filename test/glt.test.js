const test = require('tape-async');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const setup = () => {
  const cancelPipelinesStub = sinon.stub();

  const gitlabStub = { cancelPipelines: cancelPipelinesStub };

  const resolverStub = { resolveCIDefaults: sinon.stub().returns(() => true) };


  const fixtures = {
    gitlabStub,
    cancelPipelinesStub,
    resolverStub,
  };

  return fixtures;
};

const teardown = () => {
  sinon.restore();
};

test('cancelPipelines error is handled', async (assert) => {
  assert.plan(2);

  const { gitlabStub, cancelPipelinesStub, resolverStub } = setup();

  cancelPipelinesStub.throws();
  assert.doesNotThrow(() => proxyquire('../src/glt-ci-cancel', {
    './service/gitlab': gitlabStub,
    '.lib/resolver': resolverStub,
  }), 'cancelPipelines error was caught');

  teardown();
  assert.ok(cancelPipelinesStub.calledOnce, 'cancelPipelines was called');
});
