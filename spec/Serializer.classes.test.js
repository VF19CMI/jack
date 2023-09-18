import test from 'ava';
import { Serializer } from '../lib/Serializer.js';

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
