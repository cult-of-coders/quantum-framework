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

        let methods = {};
        if (config.insert === undefined || config.insert) {
            QF.add('method', `${prefix}.insert`, {
                allowedRoles: config.allowedRoles,
                handler(data) {
                    firewall(this, 'insert', data);

                    return collection.insert(data);
                }
            });
        }

        if (config.update === undefined || config.update) {
            QF.add('method', `${prefix}.update`, {
                allowedRoles: config.allowedRoles,
                handler(modifier, _id) {
                    firewall(this, 'update', collection.findOne(_id), modifier);

                    return collection.update(_id, modifier);
                }
            });
        }

        if (config.update_simple === undefined || config.update_simple) {
            QF.add('method', `${prefix}.update_simple`, {
                allowedRoles: config.allowedRoles,
                handler(values, _id) {
                    firewall(this, 'update', _id, {$set: values});

                    return collection.update(_id, {$set: values});
                }
            });
        }

        if (config.remove === undefined || config.remove) {
            QF.add('method', `${prefix}.remove`, {
                allowedRoles: config.allowedRoles,
                handler(_id) {
                    firewall(this, 'remove', collection.findOne(_id));

                    return collection.remove(_id);
                }
            });
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
            update_simple: {
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

Quantum.instance.plugin('collection-mutators', plugin);


QF.plugin('collection').extend({
    'mutators': {
        type: Object,
        blackbox: true,
        optional: true
    }
}, function (atom) {
    if (atom.config.mutators) {
        QF.add('collection-mutators', atom.name, atom.config.mutators);
    }
});