var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        let collection = new Mongo.Collection(atom.name);

        if (config.model) {
            collection.helpers(config.model)
        }
        if (config.extend) {
            _.extend(collection, config.extend);
        }

        if (config.schema) {
            let schema = Quantum.instance.use('schema', config.schema);

            collection.attachSchema(schema);
        }

        return collection;
    }

    schema() {
        return {
            'extend': {
                type: Object,
                optional: true,
                blackbox: true
            },
            model: {
                type: Object,
                optional: true,
                blackbox: true
            },
            'schema': {
                type: String,
                optional: true
            }
        }
    }

    executionContext() {
        return 'boot'
    }
};

Quantum.instance.plugin('collection', plugin);