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

  t.is(JSON.stringify(expected), car.serialize().toJSON());
});

test('using simple class with more attributess', t => {
  class Car extends Serializeable {
    type = 'cars';
    serializerConfig = {
      attributes: [
        'name'
      ]
    }

    constructor({ id, name }) {
      super();
      this.id = id;
      this.name = name;
    }
  };

  const car = new Car({ id: 2, name: 'BMW' });
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

  t.is(JSON.stringify(expected), car.serialize().toJSON());
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

    constructor({ id, name, roles }) {
      super();
      this.id = id;
      this.name = name;
      this.roles = roles;
    }

    isAdmin() {
      return this.roles.includes('ADMIN');
    }
  };

  const user = new User({ id: 2, name: 'Krisz', roles: ['ADMIN', 'USER'] });
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

  t.is(JSON.stringify(expected), user.serialize().toJSON());
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

    constructor({ id, name, roles }) {
      super();
      this.id = id;
      this.name = name;
      this.roles = roles;
    }

    isAdmin() {
      return this.roles.includes('ADMIN');
    }
  };

  const user = new User({ id: 2, name: 'Krisz', roles: ['USER'] });
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

  t.is(JSON.stringify(expected), user.serialize().toJSON());
});

test('using simple class with function and objects as attributes', t => {
  class User extends Serializeable {
    type = 'users';
    serializerConfig = {
      attributes: [
        { name: 'name' },
        { name: 'admin', value: (t) => t.isAdmin() }
      ]
    }

    constructor({ id, name, roles }) {
      super();
      this.id = id;
      this.name = name;
      this.roles = roles;
    }

    isAdmin() {
      return this.roles.includes('ADMIN');
    }
  };

  const user = new User({ id: 2, name: 'Krisz', roles: ['USER'] });
  const expected =   {
    data: {
      id: 2,
      type: 'users',
      attributes: {
        name: 'Krisz',
        admin: false
      },
      relationships: {}
    },
    included: []
  };

  t.is(JSON.stringify(expected), user.serialize().toJSON());
});

test('using simple class with relationships', t => {
  class User extends Serializeable {
    type = 'users';
    serializerConfig = {
      attributes: [
        { name: 'name' },
        { name: 'admin', value: (t) => t.isAdmin() }
      ],
      relationships: [
        'roles'
      ]
    }

    constructor({ id, name }) {
      super();
      this.id = id;
      this.name = name;
      this.roles = [];
    }

    isAdmin() {
      return this.roles.findIndex(r => r.title === 'ADMIN') > -1;
    }
  };

  class Role extends Serializeable {
    type = 'roles';
    serializerConfig = {
      attributes: [
        { name: 'title' },
      ]
    }

    constructor({ id, title }) {
      super();
      this.id = id;
      this.title = title;
    }
  }

  const user = new User({ id: 2, name: 'Krisz' });
  user.roles = [
    new Role({ id: 5, title: 'SUPERUSER' }),
    new Role({ id: 6, title: 'USER' })
  ];

  const expected =   {
    data: {
      id: 2,
      type: 'users',
      attributes: { name: 'Krisz', admin: false },
      relationships: {
        roles: {
          data: [
            { id: 5, type: 'roles' },
            { id: 6, type: 'roles' }
          ]
        }
      }
    },
    included: [
      { id: 5, type: 'roles', attributes: { title: 'SUPERUSER' }, relationships: {} },
      { id: 6, type: 'roles', attributes: { title: 'USER' }, relationships: {} },
    ]
  };

  t.is(JSON.stringify(expected), user.serialize().toJSON());
});

test('using simple class with relationships 2', t => {
  class User extends Serializeable {
    type = 'users';
    serializerConfig = {
      attributes: [
        { name: 'name' },
        { name: 'admin', value: (t) => t.isAdmin() }
      ],
      relationships: [
        'roles'
      ]
    }

    constructor({ id, name }) {
      super();
      this.id = id;
      this.name = name;
      this.roles = [];
    }

    isAdmin() {
      return this.roles.findIndex(r => r.title === 'ADMIN') > -1;
    }
  };

  class Role extends Serializeable {
    type = 'roles';
    serializerConfig = {
      attributes: [
        { name: 'title' },
      ]
    }

    constructor({ id, title }) {
      super();
      this.id = id;
      this.title = title;
    }
  }

  const user = new User({ id: 2, name: 'Krisz' });
  user.roles = [
    new Role({ id: 5, title: 'SUPERUSER' }),
    new Role({ id: 6, title: 'ADMIN' })
  ];

  const expected =   {
    data: {
      id: 2,
      type: 'users',
      attributes: { name: 'Krisz', admin: true },
      relationships: {
        roles: {
          data: [
            { id: 5, type: 'roles' },
            { id: 6, type: 'roles' }
          ]
        }
      }
    },
    included: [
      { id: 5, type: 'roles', attributes: { title: 'SUPERUSER' }, relationships: {} },
      { id: 6, type: 'roles', attributes: { title: 'ADMIN' }, relationships: {} },
    ]
  };

  t.is(JSON.stringify(expected), user.serialize().toJSON());
});
