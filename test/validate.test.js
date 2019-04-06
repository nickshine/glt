const test = require('tape-async');
const sinon = require('sinon');
const clearRequire = require('clear-require');

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
  clearRequire('../src/glt');
  clearRequire('../src/glt-ci');
};

test('invalid command', (assert) => {
  assert.plan(1);

  const { processStub } = setup();
  sinon.stub(process, 'argv').value(['node', './src/glt.js', 'invalid-command']);
  sinon.stub(process, 'env').value({});

  /* eslint-disable global-require */
  require('../src/glt');

  teardown();
  assert.ok(processStub.calledWith(1), 'Command not found');
});

test('valid command', (assert) => {
  assert.plan(1);

  const { processStub } = setup();
  sinon.stub(process, 'argv').value(['node', './src/glt.js', 'ci']);
  sinon.stub(process, 'env').value({});

  /* eslint-disable global-require */
  require('../src/glt');

  teardown();
  assert.ok(processStub.notCalled, 'Valid command entered');
});

test('invalid command glt-ci', (assert) => {
  assert.plan(1);

  const { processStub } = setup();
  sinon.stub(process, 'argv').value(['node', './src/glt-ci.js', 'invalid-command']);
  sinon.stub(process, 'env').value({});

  /* eslint-disable global-require */
  require('../src/glt-ci');

  teardown();
  assert.ok(processStub.calledWith(1), 'Command not found');
});

test('valid command glt-ci', (assert) => {
  assert.plan(1);

  const { processStub } = setup();
  sinon.stub(process, 'argv').value(['node', './src/glt-ci.js', 'cancel']);
  sinon.stub(process, 'env').value({});

  /* eslint-disable global-require */
  require('../src/glt-ci');

  teardown();
  assert.ok(processStub.notCalled, 'Valid command entered');
});

test('valid command glt-ci verbose', (assert) => {
  assert.plan(1);

  const { processStub } = setup();
  sinon.stub(process, 'argv').value(['node', './src/glt-ci.js', 'cancel', '-v']);
  sinon.stub(process, 'env').value({});

  /* eslint-disable global-require */
  require('../src/glt-ci');

  teardown();
  assert.ok(processStub.notCalled, 'Valid command entered with verbose flag');
});

