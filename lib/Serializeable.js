import { Serializer } from './Serializer.js';

class Serializeable {
  serializerConfig = {
    attributes: [],
    relationships: []
  };

  constructor() {}

  serialize() {
    return (new Serializer({
      data: this,
      attributes: this.serializerConfig.attributes,
      relationships: this.serializerConfig.relationships
    })).toProcessed();
  }
}

export { Serializeable }
