import test from 'ava';
import { Serializer, MissingDataError } from '../lib/Serializer.js';

const macro = test.macro((t, input, expected) => {
  const s = new Serializer({
    data: input.data,
    attributes: input.attributes,
    relationships: input.relationships
  });

  t.is(JSON.stringify(expected), s.toJSON());
});

test('using empty serializer', t => {
  const s = new Serializer();
  const error = t.throws(() => { s.toJSON() });

  t.true(error instanceof MissingDataError);
});

test('using empty data', t => {
  const s = new Serializer({
    data: {}
  });
  const expected =   {
    data: {
      id: null,
      type: null,
      attributes: {},
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), s.toJSON());
});

test('using simple data with id/type', t => {
  const s = new Serializer({
    data: { id: 1, type: 'car' },
  });
  const expected =   {
    data: {
      id: 1,
      type: 'car',
      attributes: {},
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), s.toJSON());
});

test('using simple array data with id/type', t => {
  const s = new Serializer({
    data: [{ id: 1, type: 'car' }, { id: 2, type: 'car' }],
  });
  const expected =   {
    data: [
      {
        id: 1,
        type: 'car',
        attributes: {},
        relationships: {}
      },
      {
        id: 2,
        type: 'car',
        attributes: {},
        relationships: {}
      }
    ],
    included: []
  };

  t.is(JSON.stringify(expected), s.toJSON());
});

test('using simple data with id/type and extra data', t => {
  const s = new Serializer({
    data: { id: 1, type: 'car', brand: 'BMW' },
  });
  const expected =   {
    data: {
      id: 1,
      type: 'car',
      attributes: {},
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), s.toJSON());
});

test('using simple data with attributes', t => {
  const s = new Serializer({
    data: { id: 1, type: 'car', brand: 'BMW' },
    attributes: ['brand']
  });
  const expected =   {
    data: {
      id: 1,
      type: 'car',
      attributes: {
        brand: 'BMW'
      },
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), s.toJSON());
});

test('using simple data with functions true', t => {
  const s = new Serializer({
    data: { id: 1, type: 'user', name: 'Krisz', roles: ['ADMIN', 'USER'] },
    attributes: [
      'name',
      { name: 'admin', value: (t) => t.roles.includes('ADMIN') }
    ]
  });
  const expected =   {
    data: {
      id: 1,
      type: 'user',
      attributes: {
        name: 'Krisz',
        admin: true
      },
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), s.toJSON());
});

test('using simple data with functions false', t => {
  const s = new Serializer({
    data: { id: 1, type: 'user', name: 'Krisz', roles: ['USER'] },
    attributes: [
      'name',
      { name: 'admin', value: (t) => t.roles.includes('ADMIN') }
    ]
  });
  const expected =   {
    data: {
      id: 1,
      type: 'user',
      attributes: {
        name: 'Krisz',
        admin: false
      },
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), s.toJSON());
});

test('using simple data with functions and objects as attributes', t => {
  const s = new Serializer({
    data: { id: 1, type: 'user', name: 'Krisz', roles: ['ADMIN', 'USER'] },
    attributes: [
      { name: 'name' },
      { name: 'admin', value: (t) => t.roles.includes('ADMIN') }
    ]
  });
  const expected =   {
    data: {
      id: 1,
      type: 'user',
      attributes: {
        name: 'Krisz',
        admin: true
      },
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), s.toJSON());
});
