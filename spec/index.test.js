import test from 'ava';
import * as m from '../index.js';

test('parse is exposed', t => {
  t.true(m.parse !== undefined);
  t.true(typeof m.parse === 'function');
});

test('clone is exposed', t => {
  t.true(m.clone !== undefined);
  t.true(typeof m.clone === 'function');
});

test('Serializer is exposed', t => {
  t.true(m.Serializer !== undefined);
  t.true(typeof m.Serializer === 'function' && /^\s*class\s+/.test(m.Serializer.toString()));
});

/*
test('', t => {
  const testData = {};
  const expectedData = {};

  t.deepEqual(m.parse(testData), expectedData);
});
*/
