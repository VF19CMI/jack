const generateObject = (data, included) => {
    const obj = {};

    if (Object.keys(data).length > 0) {
        ['id', 'type', 'attributes'].forEach(a => {
            obj[a] = data[a];
        });

        if (!data.attributes || Object.keys(data.attributes).length === 0)
            obj.attributes = {};

        if (data.relationships) {
            Object.keys(data.relationships).forEach(key => {
                if (data.relationships[key] && data.relationships[key].data) {
                    if (Array.isArray(data.relationships[key].data)) {
                        obj[key] = [];

                        if (included) {
                            data.relationships[key].data.forEach(r => {
                                const item = included.find(i => i.type === r.type && i.id === r.id);
                                if (item) obj[key].push(item);
                            });
                        }
                    } else {
                        const item = included.find(i => i.type === data.relationships[key].data.type && i.id === data.relationships[key].data.id);
                        obj[key] = item || {};
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
    let parsed;

    if (Array.isArray(r.data)) {
        // data contains a list of objects
        parsed = [];
    } else {
        // data is a single object
        parsed = generateObject(r.data, r.included);
    }

    return parsed;
}



module.exports = {
    parse
}
