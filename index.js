const generateObject = (data, included) => {
  const obj = {};

  if (Object.keys(data).length > 0) {
    ['id', 'type', 'attributes'].forEach(a => {
      obj[a] = data[a];
    });

    if (!data.attributes || Object.keys(data.attributes).length === 0) obj.attributes = {};

    if (data.relationships) {
      Object.keys(data.relationships).forEach(key => {
        if (data.relationships[key] && data.relationships[key].data) {
          if (Array.isArray(data.relationships[key].data)) {
            obj[key] = [];

            if (included) {
              data.relationships[key].data.forEach(r => {
                const item = included.find(i => i.type === r.type && i.id === r.id);
                if (item) obj[key].push(generateObject(item, included));
              });
            }
          } else {
            obj[key] = {};

            if (included) {
              const item = included.find(i => i.type === data.relationships[key].data.type && i.id === data.relationships[key].data.id);
              if (item) obj[key] = generateObject(item, included);
            }
          };
        } else {
          obj[key] = {};
        }
      });
    }
  }

  return obj;
}

const parse = (r) => {
  if (!r || !r.data || r.data === null) return {};
  return Array.isArray(r.data) ? r.data.map(d => generateObject(d, r.included)) : generateObject(r.data, r.included);
}

module.exports = {
  parse
}
