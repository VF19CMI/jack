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

test('using simple class with id/type', t => {
  class Car {
    type = 'cars';

    constructor(id) {
      this.id = id
    }
  };

  const s = new Serializer({
    data: new Car(2)
  });
  const expected =   {
    data: {
      id: 2,
      type: 'cars',
      attributes: {},
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), s.toJSON());
});
