import test from 'ava';
import { Serializeable } from '../lib/Serializeable.js';

test('using simple class', t => {
  class Car extends Serializeable {
    type = 'cars';

    constructor(id) {
      super();
      this.id = id;
    }
  };

  const car = new Car(2);
  const expected =   {
    data: {
      id: 2,
      type: 'cars',
      attributes: {},
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), car.serialize());
});

test('using simple class with more attributess', t => {
  class Car extends Serializeable {
    type = 'cars';
    serializerConfig = {
      attributes: [
        'name'
      ]
    }

    constructor(id, name) {
      super();
      this.id = id;
      this.name = name;
    }
  };

  const car = new Car(2, 'BMW');
  const expected =   {
    data: {
      id: 2,
      type: 'cars',
      attributes: {
        name: 'BMW'
      },
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), car.serialize());
});

test('using simple class with function true', t => {
  class User extends Serializeable {
    type = 'user';
    serializerConfig = {
      attributes: [
        'name',
        { name: 'admin', value: (t) => t.isAdmin() }
      ]
    }

    constructor(id, name, roles) {
      super();
      this.id = id;
      this.name = name;
      this.roles = roles;
    }

    isAdmin() {
      return this.roles.includes('ADMIN');
    }
  };

  const user = new User(2, 'Krisz', ['ADMIN', 'USER']);
  const expected =   {
    data: {
      id: 2,
      type: 'user',
      attributes: {
        name: 'Krisz',
        admin: true
      },
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), user.serialize());
});

test('using simple class with function false', t => {
  class User extends Serializeable {
    type = 'user';
    serializerConfig = {
      attributes: [
        'name',
        { name: 'admin', value: (t) => t.isAdmin() }
      ]
    }

    constructor(id, name, roles) {
      super();
      this.id = id;
      this.name = name;
      this.roles = roles;
    }

    isAdmin() {
      return this.roles.includes('ADMIN');
    }
  };

  const user = new User(2, 'Krisz', ['USER']);
  const expected =   {
    data: {
      id: 2,
      type: 'user',
      attributes: {
        name: 'Krisz',
        admin: false
      },
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), user.serialize());
});

test('using simple class with function and objects as attributes', t => {
  class User extends Serializeable {
    type = 'user';
    serializerConfig = {
      attributes: [
        { name: 'name' },
        { name: 'admin', value: (t) => t.isAdmin() }
      ]
    }

    constructor(id, name, roles) {
      super();
      this.id = id;
      this.name = name;
      this.roles = roles;
    }

    isAdmin() {
      return this.roles.includes('ADMIN');
    }
  };

  const user = new User(2, 'Krisz', ['USER']);
  const expected =   {
    data: {
      id: 2,
      type: 'user',
      attributes: {
        name: 'Krisz',
        admin: false
      },
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), user.serialize());
});
