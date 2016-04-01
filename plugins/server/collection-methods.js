// Write your package code here!
let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;

        if (!config.prefix) config.prefix = atom.name;

        let prefix = config.prefix;
        let methods = {};

        let collection = Quantum.instance.use('collection', atom.name);

        let checkRoles = function (userId) {
            if (config.allowedRoles && config.allowedRoles.length) {
                Quantum.Roles.check(this.userId, config.allowedRoles);
            }
        };

        if (config.insert === undefined || config.insert) {
            methods[`${prefix}.insert`] = function (data) {
                checkRoles(this.userId);

                return collection.insert(data);
            }
        }

        if (config.update === undefined || config.update) {
            methods[`${prefix}.update`] = function (modifier, _id) {
                checkRoles(this.userId);

                return collection.update(_id, modifier);
            }
        }

        if (config.update_simple === undefined || config.update_simple) {
            methods[`${prefix}.update_simple`] = function (_id, values) {
                checkRoles(this.userId);

                return collection.update(_id, {$set: values});
            }
        }

        if (config.remove === undefined || config.remove) {
            methods[`${prefix}.remove`] = function (_id) {
                checkRoles(this.userId);

                return collection.remove(_id);
            }
        }

        Meteor.methods(methods)
    }

    schema() {
        return {
            prefix: {
                type: String,
                optional: true
            },
            allowedRoles: {
                type: [String],
                defaultValue: [],
                optional: true
            },
            insert: {
                type: Boolean,
                optional: true
            },
            update: {
                type: Boolean,
                optional: true
            },
            update_simple: {
                type: Boolean,
                optional: true
            },
            remove: {
                type: Boolean,
                optional: true
            }
        }
    }
};

Quantum.instance.plugin('collection-methods', plugin);