var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let collection = Quantum.instance.use('collection', atom.name);
        let config = atom.config;
        let filterManipulator = new Quantum.Model.FilterManipulation(config.filtersByRoles, config.fieldsByRoles);

        collection.secureFilters = (userId, filters = {}, options = {}) => {
            filterManipulator.apply(userId, filters, options);
        };

        collection.findSecure = (userId, filters = {}, options = {}) => {
            collection.secureFilters(userId, filters, options);

            return collection.find(filters, options);
        };

        Meteor.publishComposite(atom.name, (filters = {}, options = {}) => {
            filterManipulator.apply(this.userId, filters, options);

            let returnable = {};
            returnable.find = function () {
                return collection.find(filters, options);
            };

            if (config.composition) {
                returnable.children = config.composition;
            }

            return returnable;
        });

        let methods = {};
        methods[`${atom.name}.count`] = function (filters = {}) {
            filterManipulator.apply(this.userId, filters);

            return collection.find(filters).count()
        };

        Meteor.methods(methods);
    }

    schema() {

    }

    executionContext() {
        return 'boot'
    }
};

Quantum.instance.plugin('collection-exposure', plugin);