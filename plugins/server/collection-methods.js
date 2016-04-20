// Write your package code here!
let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        if (!config.prefix) config.prefix = atom.name;

        let prefix = config.prefix;
        let collection = Quantum.instance.use('collection', config.collection);

        let firewall = function (bindContext, context, ...args) {
            if (config.firewall) {
                let run = config.firewall.bind(bindContext);
                run(context, ...args)
            }
        };

        let checkRoles = function (userId) {
            if (config.allowedRoles && config.allowedRoles.length) {
                Quantum.Roles.check(this.userId, config.allowedRoles);
            }
        };

        let methods = {};
        if (config.insert === undefined || config.insert) {
            methods[`${prefix}.insert`] = function (data) {
                checkRoles(this.userId);
                firewall(this, 'insert', data);

                return collection.insert(data);
            }
        }

        if (config.update === undefined || config.update) {
            methods[`${prefix}.update`] = function (modifier, _id) {
                checkRoles(this.userId);
                firewall(this, 'update', collection.findOne(_id), modifier);

                return collection.update(_id, modifier);
            }
        }

        if (config.update_simple === undefined || config.update_simple) {
            methods[`${prefix}.update_simple`] = function (_id, values) {
                checkRoles(this.userId);
                firewall(this, 'update', _id, {$set: values});

                return collection.update(_id, {$set: values});
            }
        }

        if (config.remove === undefined || config.remove) {
            methods[`${prefix}.remove`] = function (_id) {
                checkRoles(this.userId);
                firewall(this, 'remove', collection.findOne(_id));

                return collection.remove(_id);
            }
        }

        Meteor.methods(methods);
    }

    schema() {
        return {
            firewall: {
                type: Function,
                optional: true
            },
            collection: {
                type: String
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