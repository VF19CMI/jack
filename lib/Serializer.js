class MissingDataError extends Error {}

class FieldType {
  static Value = new FieldType('FieldType.Value')
  static Function = new FieldType('FieldType.Function')

  constructor(name) {
    this.name = name;
  }
}

class ProcessResult {
  constructor({ data, included = [] }) {
    this.data = data;
    this.included = included;
  }

  toJSON() {
    return JSON.stringify({ data: this.data, included: this.included });
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
    if (typeof rel === 'string') {
      this.#rules.relationships.push({ name: rel });
    }
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

      this.#rules.relationships.forEach(rel => {
        data.relationships[rel.name] = { 'data': null };

        if (Array.isArray(input[rel.name])) {
          data.relationships[rel.name].data = [];

          input[rel.name].forEach(r => {
            if (typeof r.serialize === 'function') {
              const rr = r.serialize();
              data.relationships[rel.name].data.push({ id: rr.data.id, type: rr.data.type });
              included.push(rr.data);
            }
          });
        } else {

        }
      });

      // set included
    }

    return new ProcessResult({ data, included });
  }

  toProcessed() {
    if (this.#data === undefined) throw new MissingDataError();
    return this.#processDataBlock({ input: this.#data });
  }

  toJSON() {
    return this.toProcessed().toJSON();
  }
}

export {
  Serializer,
  MissingDataError
};
