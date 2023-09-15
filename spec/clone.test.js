import test from 'ava';
import { parse } from '../lib/parse.js';
import { clone } from '../lib/clone.js';

test('clone: simple object without attributes', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1'
    }
  };
  const testParsed = parse(testData);
  const testCloned = clone(testParsed);

  t.deepEqual(testCloned, testParsed);
  t.not(testParsed, testCloned);
});

test('clone: simple object with relationships and includes', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1',
      relationships: {
        tasks: {
          data: [
            { type: 'tasks', id: '1' }
          ]
        }
      }
    },
    included: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' } }
    ]
  };
  const testParsed = parse(testData);
  const testCloned = clone(testParsed);

  t.deepEqual(testCloned, testParsed);
  t.not(testParsed, testCloned);
});
