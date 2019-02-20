import test from 'ava';

const m = require('./index.js');

test('parse is exposed', t => {
    t.true(m.parse !== undefined);
});

test('parse: return empty object on empty data', t => {
    t.deepEqual(m.parse(undefined), {});
    t.deepEqual(m.parse({ data: null }), {});
    t.deepEqual(m.parse({ data: undefined }), {});
});

test('parse: return empty  on empty array', t => {
    t.deepEqual(m.parse({ data: [] }), []);
    t.deepEqual(m.parse({ data: {} }), {});
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

    t.deepEqual(m.parse(testData), expectedData);
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

    t.deepEqual(m.parse(testData), expectedData);
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

    t.deepEqual(m.parse(testData), expectedData);
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

    t.deepEqual(m.parse(testData), expectedData);
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

    t.deepEqual(m.parse(testData), expectedData);
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

    t.deepEqual(m.parse(testData), expectedData);
});

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

    t.deepEqual(m.parse(testData), expectedData);
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

    t.deepEqual(m.parse(testData), expectedData);
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

    t.deepEqual(m.parse(testData), expectedData);
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

    t.deepEqual(m.parse(testData), expectedData);
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

    t.deepEqual(m.parse(testData), expectedData);
});

test('parse: a simple array with includes', t => {
    const testData = {
        data: [
            {
                type: 'tasks', id: '1', attributes: { name: 'Test 1' },
                relationships: { owner: { type: 'owner', id: '1' } }
            },
            {
                type: 'tasks', id: '2', attributes: { name: 'Test 2' },
                relationships: { owner: { type: 'owner', id: '1' } }
            },
            {
                type: 'tasks', id: '3', attributes: { name: 'Test 3' },
                relationships: { owner: { type: 'owner', id: '2' } }
            }
        ],
        included: [
            { type: 'owner', id: '1', attributes: { name: 'God' } },
            { type: 'owner', id: '2', attributes: { name: 'Jesus' } }
        ]
    };
    const expectedData = [
        { type: 'tasks', id: '1', attributes: { name: 'Test 1' }, owner: { type: 'owner', id: '1', attributes: { name: 'God' } } },
        { type: 'tasks', id: '2', attributes: { name: 'Test 2' }, owner: { type: 'owner', id: '1', attributes: { name: 'God' } } },
        { type: 'tasks', id: '3', attributes: { name: 'Test 3' }, owner: { type: 'owner', id: '2', attributes: { name: 'Jesus' } } }
    ];

    t.deepEqual(m.parse(testData), expectedData);
});


/*
test('', t => {
    const testData = {};
    const expectedData = {};

    t.deepEqual(m.parse(testData), expectedData);
});
*/
