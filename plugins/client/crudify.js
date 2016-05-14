let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;

        ({namePrefix, pathPrefix, allowedRoles} = config.routing);

        if (config.list) {
            QF.add('route', `${pathPrefix}/list`, {
                name: `${namePrefix}.list`,
                template: `${atom.name}List`,
                allowedRoles: allowedRoles
            });

            if (config.listify) {
                config.listify.collection = (config.listify.collection ? config.listify.collection : config.collection);

                QF.add('template-listify', `${atom.name}List`, config.listify);
            }
        }

        if (config.edit) {
            QF.add('route', `${pathPrefix}/:_id/edit`, {
                name: `${namePrefix}.edit`,
                template: `${atom.name}Edit`,
                allowedRoles: allowedRoles,
                waitOn: function () {
                    return Meteor.subscribe(config.collection, {
                        _id: this.params._id
                    })
                },
                data: function () {
                    return QF.use('collection', config.collection).findOne({_id: this.params._id})
                }
            });

            if (config.formify) {
                QF.add('template-formify', `${atom.name}Edit`, config.formify);
            }
        }

        if (config.create) {
            QF.add('route', `${pathPrefix}/create`, {
                name: `${namePrefix}.create`,
                template: `${atom.name}Create`,
                allowedRoles: allowedRoles
            });

            if (config.formify) {
                QF.add('template-formify', `${atom.name}Create`, config.formify);
            }
        }
    }

    schema() {
        return {
            collection: {
                type: String
            },
            routing: {
                type: new SimpleSchema({
                    namePrefix: {type: String},
                    pathPrefix: {type: String},
                    allowedRoles: {type: [String], optional: true}
                })
            },
            listify: {
                type: Object,
                blackbox: true,
                defaultValue: {}
            },
            formify: {
                type: Object,
                blackbox: true,
                defaultValue: {}
            },
            list: {
                type: Boolean,
                defaultValue: true
            },
            create: {
                type: Boolean,
                defaultValue: true
            },
            edit: {
                type: Boolean,
                defaultValue: true
            }
        }
    }

    requires() {
        return ['route']
    }
};

QF.plugin('crudify', plugin);