import test from 'ava';
import { parse } from '../lib/parse.js';

test('parse: return empty object on empty data', t => {
  t.deepEqual(parse(undefined), {});
  t.deepEqual(parse({ data: null }), {});
  t.deepEqual(parse({ data: undefined }), {});
});

test('parse: return empty  on empty array', t => {
  t.deepEqual(parse({ data: [] }), []);
  t.deepEqual(parse({ data: {} }), {});
});

test('parse: simple object without attributes', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1'
    }
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {}
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: simple object with attributes', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1',
      attributes: {
        name: 'test list',
        owner: 'God'
      }
    }
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {
      name: 'test list',
      owner: 'God'
    }
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: simple object with empty relationship array', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1',
      relationships: {
        tasks: {
          data: []
        }
      }
    }
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    tasks: []
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: simple object with empty relationship object', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1',
      relationships: {
        owner: {
          data: null
        }
      }
    }
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    owner: {}
  };

  t.deepEqual(parse(testData), expectedData);
});


test('parse: simple object with relationships but no includes', t => {
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
    }
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    tasks: []
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: simple object with relationships and includes', t => {
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
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    tasks: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' } }
    ]
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: simple object with relationships and includes (nested)', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1',
      relationships: {
        tasks: {
          data: { type: 'tasks', id: '1' }
        }
      }
    },
    included: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' }, relationships: { owner: { data: { type: 'owners', id: '1' } } } },
      { type: 'owners', id: '1', attributes: { name: 'Nested God' } }
    ]
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    tasks: { type: 'tasks', id: '1', attributes: { name: 'Test 1' }, owner: { id: '1', type: 'owners', attributes: { name: 'Nested God' } } }
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: simple object with relationships and includes array (nested)', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1',
      relationships: {
        tasks: {
          data: [
            { type: 'tasks', id: '1' },
            { type: 'tasks', id: '2' }
          ]
        }
      }
    },
    included: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' }, relationships: { owner: { data: { type: 'owners', id: '1' } } } },
      { type: 'tasks', id: '2', attributes: { name: 'Test 2' }, relationships: { owner: { data: { type: 'owners', id: '1' } } } },
      { type: 'owners', id: '1', attributes: { name: 'Nested God' } }
    ]
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    tasks: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' }, owner: { id: '1', type: 'owners', attributes: { name: 'Nested God' } } },
      { type: 'tasks', id: '2', attributes: { name: 'Test 2' }, owner: { id: '1', type: 'owners', attributes: { name: 'Nested God' } } }
    ]
  };

  t.deepEqual(parse(testData), expectedData);
});

// TODO nested with bad data

test('parse: simple object with relationships and includes with wrong data', t => {
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
      { type: 'tasks', id: '2', attributes: { name: 'Test 2' } }
    ]
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    tasks: []
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: simple object with relationships and includes with wrong data 2', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1',
      relationships: {
        owner: {
          data: { type: 'owner', id: '1' }
        }
      }
    },
    included: [
      { type: 'owner', id: '2', attributes: { name: 'God 2' } }
    ]
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    owner: {}
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: simple object with relationships (array) and includes', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1',
      relationships: {
        tasks: {
          data: [
            { type: 'tasks', id: '1' },
            { type: 'tasks', id: '2' }
          ]
        }
      }
    },
    included: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' } },
      { type: 'tasks', id: '2', attributes: { name: 'Test 2' } }
    ]
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    tasks: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' } },
      { type: 'tasks', id: '2', attributes: { name: 'Test 2' } }
    ]
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: simple object with multiple relationships and includes', t => {
  const testData = {
    data: {
      type: 'tasklists',
      id: '1',
      relationships: {
        tasks: {
          data: [
            { type: 'tasks', id: '1' },
            { type: 'tasks', id: '2' }
          ]
        },
        owner: {
          data: { type: 'owner', id: '1' }
        }
      }
    },
    included: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' } },
      { type: 'tasks', id: '2', attributes: { name: 'Test 2' } },
      { type: 'owner', id: '1', attributes: { name: 'God' } }
    ]
  };
  const expectedData = {
    type: 'tasklists',
    id: '1',
    attributes: {},
    tasks: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' } },
      { type: 'tasks', id: '2', attributes: { name: 'Test 2' } },
    ],
    owner: {
      type: 'owner', id: '1', attributes: { name: 'God' }
    }
  };

  t.deepEqual(parse(testData), expectedData);
});

test('parse: a simple array', t => {
  const testData = {
    data: [
      { type: 'tasks', id: '1', attributes: { name: 'Test 1' } },
      { type: 'tasks', id: '2', attributes: { name: 'Test 2' } },
      { type: 'tasks', id: '3', attributes: { name: 'Test 3' } }
    ]
  };
  const expectedData = [
    { type: 'tasks', id: '1', attributes: { name: 'Test 1' } },
    { type: 'tasks', id: '2', attributes: { name: 'Test 2' } },
    { type: 'tasks', id: '3', attributes: { name: 'Test 3' } }
  ];

  t.deepEqual(parse(testData), expectedData);
});

test('parse: a simple array with includes', t => {
  const testData = {
    data: [
      {
        type: 'tasks', id: '1', attributes: { name: 'Test 1' },
        relationships: { owner: { data: { type: 'owners', id: '1' } } }
      },
      {
        type: 'tasks', id: '2', attributes: { name: 'Test 2' },
        relationships: { owner: { data: { type: 'owners', id: '1' } } }
      },
      {
        type: 'tasks', id: '3', attributes: { name: 'Test 3' },
        relationships: { owner: { data: { type: 'owners', id: '2' } } }
      }
    ],
    included: [
      { type: 'owners', id: '1', attributes: { name: 'God' } },
      { type: 'owners', id: '2', attributes: { name: 'Jesus' } }
    ]
  };
  const expectedData = [
    { type: 'tasks', id: '1', attributes: { name: 'Test 1' }, owner: { type: 'owners', id: '1', attributes: { name: 'God' } } },
    { type: 'tasks', id: '2', attributes: { name: 'Test 2' }, owner: { type: 'owners', id: '1', attributes: { name: 'God' } } },
    { type: 'tasks', id: '3', attributes: { name: 'Test 3' }, owner: { type: 'owners', id: '2', attributes: { name: 'Jesus' } } }
  ];

  t.deepEqual(parse(testData), expectedData);
});

test('parse (config): maxDepthLevel bigger than the parsed', t => {
  const testData = {
    data: {
      type: 'projects', id: '1', attributes: { name: 'Project 1' },
      relationships: {
        tasks: { data: [{ type: 'tasks', id: '1' }] }
      }
    },
    included: [
      { type: 'tasks', id: '1', attributes: { name: 'Task 1' }, relationships: { owner: { data: { type: 'owners', id: '1' } } } },
      { type: 'owners', id: '1', attributes: { name: 'Owner 1' } }
    ]
  };

  const expectedData = {
    type: 'projects', id: '1', attributes: { name: 'Project 1' },
    tasks: [
      { type: 'tasks', id: '1', attributes: { name: 'Task 1' }, owner: { id: '1', type: 'owners', attributes: { name: 'Owner 1' } } },
    ]
  };

  t.deepEqual(parse(testData, { maxDepthLevel: 3 }), expectedData);
});

test('parse (config): maxDepthLevel restricting data', t => {
  const testData = {
    data: {
      type: 'projects', id: '1', attributes: { name: 'Project 1' },
      relationships: {
        tasks: { data: [{ type: 'tasks', id: '1' }] }
      }
    },
    included: [
      { type: 'tasks', id: '1', attributes: { name: 'Task 1' }, relationships: { owner: { data: { type: 'owners', id: '1' } } } },
      { type: 'owners', id: '1', attributes: { name: 'Owner 1' } }
    ]
  };

  const expectedData = {
    type: 'projects', id: '1', attributes: { name: 'Project 1' },
    tasks: [
      { type: 'tasks', id: '1', attributes: { name: 'Task 1' }, owner: {} },
    ]
  };

  t.deepEqual(parse(testData, { maxDepthLevel: 2 }), expectedData);
});
