const test = require('tape-async');
const sinon = require('sinon');
const parseAge = require('../src/lib/age-parser');

const setup = () => {

  const clock = sinon.useFakeTimers(); // replaces Date object with timestamp 0

  const fixtures = {
    clock,
  };

  return fixtures;
};

const teardown = () => {
  sinon.restore();
};

test('parseAge - hours', (assert) => {
  assert.plan(1);

  setup();

  const actual = parseAge('1h');
  const expected = -(60 * 60 * 1000); // 1 hour in ms

  teardown();

  assert.equals(actual, expected, 'Age in hours parsed correctly');
});

test('parseAge - days', (assert) => {
  assert.plan(1);

  setup();

  const actual = parseAge('1d');
  const expected = -(60 * 60 * 24 * 1000); // 1 day in ms

  teardown();

  assert.equals(actual, expected, 'Age in days parsed correctly');
});

test('parseAge - weeks', (assert) => {
  assert.plan(1);

  setup();

  const actual = parseAge('1w');
  const expected = -(60 * 60 * 24 * 7 * 1000); // 1 week in ms

  teardown();

  assert.equals(actual, expected, 'Age in weeks parsed correctly');
});

test('parseAge - default', (assert) => {
  assert.plan(1);

  setup();

  const actual = parseAge('1z');
  const expected = 0; // invalid ages default to zero

  teardown();

  assert.equals(actual, expected, 'default age was 0 as expected');
});
