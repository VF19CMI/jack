class MissingDataError extends Error {}

class FieldType {
  static Value = new FieldType('FieldType.Value')
  static Function = new FieldType('FieldType.Function')

  constructor(name) {
    this.name = name;
  }
}

class Serializer {
  #data = undefined;
  #rules = {
    root: [
      { name: 'id', type: FieldType.Value },
      { name: 'type', type: FieldType.Value }
    ],
    attributes: [],
    relationships: []
  };

  constructor({ data = undefined, attributes = [], relationships = [] } = {}) {
    this.#data = data;
    this.#parseRules({ attributes, relationships });
  }

  #parseRules({ attributes = [], relationships = []}) {
    attributes.forEach(attr => {
      this.#parseAttributeRule(attr);
    });
    relationships.forEach(rel => {
      this.#parseRelationshipRule(rel);
    });
  }

  #parseAttributeRule(attr) {
    if (typeof attr === 'string') {
      this.#rules.attributes.push({ name: attr, type: FieldType.Value });
    } else {
      if (attr.value) {
        this.#rules.attributes.push({ name: attr.name, type: FieldType.Function, value: attr.value });
      } else {
        this.#rules.attributes.push({ name: attr.name, type: FieldType.Value });
      }
    }
  }

  #parseRelationshipRule(rel) {
  }

  #processDataBlock({ input }) {
    let data;
    let included = [];

    if (Array.isArray(input)) {
      data = input.map(i => {
        let result = this.#processDataBlock({ input: i });
        included = included.concat(result.included);
        return result.data;
      });
    } else {
      data = {
        id: input.id || null,
        type: input.type || null,
        attributes: {},
        relationships: {}
      };

      this.#rules.root.forEach(attr => {
        switch (attr.type) {
          case (FieldType.Value): {
            data[attr.name] = input[attr.name] || null; break;
          }
        }
      });

      this.#rules.attributes.forEach(attr => {
        switch (attr.type) {
          case (FieldType.Value): {
            data.attributes[attr.name] = input[attr.name]; break;
          }
          case (FieldType.Function): {
            data.attributes[attr.name] = attr.value(input); break;
          }
        }
      });

      // set relationships

      // set included
    }

    return { data, included };
  }

  toJSON() {
    if (this.#data === undefined) throw new MissingDataError();
    return JSON.stringify(this.#processDataBlock({ input: this.#data }));
  }
}

export {
  Serializer,
  MissingDataError
};
