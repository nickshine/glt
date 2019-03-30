const test = require('tape-async');
const sinon = require('sinon');
const clearRequire = require('clear-require');
// const program = require('commander');

const setup = () => {
  const fixtures = {
    processStub: sinon.stub(process, 'exit'),
    // helpStub: sinon.stub(program, 'help'),
    // commandsStub: sinon.stub(program, 'commands').value([]),
  };

  return fixtures;
};

const teardown = () => {
  sinon.restore();
  clearRequire('../src/glt');
};

test('invalid command', async (assert) => {
  assert.plan(1);

  const { processStub } = setup();
  sinon.stub(process, 'argv').value(['node', './src/glt.js', 'invalid-command']);
  sinon.stub(process, 'env').value({});

  /* eslint-disable global-require */
  require('../src/glt');

  teardown();
  assert.ok(processStub.calledWith(1), 'Command not found');
});

test('valid command', async (assert) => {
  assert.plan(1);

  const { processStub } = setup();
  sinon.stub(process, 'argv').value(['node', './src/glt.js', 'ci']);
  sinon.stub(process, 'env').value({});

  /* eslint-disable global-require */
  require('../src/glt');

  teardown();
  assert.ok(processStub.notCalled, 'Invalid command called exit(1)');
});
