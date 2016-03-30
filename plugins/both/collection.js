var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        let collection = new Mongo.Collection(config.table);

        if (config.helpers) {
            collection.helpers(config.helpers)
        }

        if (config.schema) {
            let schema = Quantum.instance.use('schema', config.schema);

            collection.attachSchema(schema);
        }

        return collection;
    }

    schema() {
        return {
            'table': {
                type: String
            },
            'helpers': {
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