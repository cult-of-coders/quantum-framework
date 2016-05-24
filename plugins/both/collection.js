var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config,
            collection,
            utils = QF.use('service' , 'quantum.utils');

        if (config.existingCollection) {
            collection = config.existingCollection;
        } else {
            collection = new Mongo.Collection(atom.name);
        }

        if (config.model) collection.helpers(config.model);
        if (config.extend) _.extend(collection, config.extend);

        if (config.schema) {
            collection.attachSchema(utils.getSchema(config.schema));
        }

        _.extend(collection, {
            findByIds(ids) {
                if (!ids) ids = [];

                return this.find({_id: {$in: ids}})
            },
            findOneReactive(id) {
                return _.first(this.find(id).fetch())
            }
        });

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
                blackbox: true,
                defaultValue: {}
            },
            'schema': {
                type: null,
                blackbox: true,
                optional: true
            },
            'existingCollection': {
                type: null,
                blackbox: true,
                optional: true
            }
        }
    }

    executionContext() {
        return 'boot'
    }
};

Quantum.instance.plugin('collection', plugin);