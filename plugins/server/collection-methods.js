// Write your package code here!
let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        let prefix = config.prefix;
        let methods = {};

        let collection = Quantum.instance.use('collection', atom.name);

        let checkRoles = function (userId) {
            if (config.allowedRoles && config.allowedRoles.length) {
                Quantum.Roles.check(this.userId, config.allowedRoles);
            }
        };

        if (config.insert) {
            methods[`${prefix}.insert`] = function (data) {
                checkRoles(this.userId);

                return collection.insert(data);
            }
        }

        if (config.update) {
            methods[`${prefix}.update`] = function (modifier, _id) {
                checkRoles(this.userId);

                return collection.update(_id, modifier);
            }
        }

        if (config.remove) {
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
                type: String
            },
            allowedRoles: {
                type: [String],
                defaultValue: [],
                optional: true
            },
            insert: {
                type: Boolean,
                defaultValue: true
            },
            update: {
                type: Boolean,
                defaultValue: true
            },
            remove: {
                type: Boolean,
                defaultValue: true
            }
        }
    }
};

Quantum.instance.plugin('collection-methods', plugin);