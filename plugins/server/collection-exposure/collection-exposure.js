var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        let collection = Quantum.instance.use('collection', atom.name);

        let filterManipulator = new Quantum.Model.FilterManipulation(config.secureByRoles);

        let enforceMaxLimit = function (options) {
            if (!config.maxLimit) return;

            if (options.limit) {
                if (options.limit > config.maxLimit) {
                    options.limit = config.maxLimit;
                }
            } else {
                options.limit = config.maxLimit;
            }
        };

        collection.secureFilters = (userId, filters = {}, options = {}) => {
            filterManipulator.apply(userId, filters, options);
        };

        collection.findSecure = (userId, filters = {}, options = {}) => {
            collection.secureFilters(userId, filters, options);

            return collection.find(filters, options);
        };

        Meteor.publishComposite(atom.name, function (filters = {}, options = {}) {
            let returnable = {};
            returnable.find = function () {
                enforceMaxLimit(options);

                return collection.findSecure(this.userId, filters, options);
            };

            if (config.composition) {
                returnable.children = config.composition;
            }

            return returnable;
        });

        let methods = {};

        methods[`${atom.name}.count`] = function (filters = {}) {
            return collection.findSecure(this.userId, filters, {}).count()
        };

        methods[`${atom.name}.find`] = function (filters = {}, options = {}) {
            return collection.findSecure(this.userId, filters, options).fetch()
        };

        methods[`${atom.name}.find_ids`] = function (filters = {}, options ={}) {
            options.fields = {_id: 1};
            let results = collection.findSecure(this.userId, filters, options).fetch()

            return _.pluck(results, '_id');
        };

        Meteor.methods(methods);
    }

    schema() {
        return {
            secureByRoles: {
                type: Object,
                blackbox: true,
                optional: true
            },
            composition: {
                type: [Object],
                optional: true
            },
            maxLimit: {
                type: Number,
                defaultValue: 100
            }
        }
    }

    executionContext() {
        return 'boot'
    }
};

Quantum.instance.plugin('collection-exposure', plugin);