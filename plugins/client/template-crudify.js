let plugin = class extends Quantum.Model.Plugin {
    fixConfig(config) {
        if (config.list === undefined) {
            config.list = true;
        }
        if (config.edit === undefined) {
            config.edit = true;
        }
        if (config.create === undefined) {
            config.create = true;
        }
    }

    build(atom) {
        let config = atom.config;
        this.fixConfig(config);

        let routeNamePrefix, routePathPrefix;

        [routeNamePrefix, routePathPrefix] = config.routing;

        if (config.list) {
            QF.add('route', `${routePathPrefix}/list`, {
                name: `${routeNamePrefix}.list`,
                template: `${atom.name}List`
            });

            if (config.listify) {
                config.listify.collection = (config.listify.collection ? config.listify.collection : config.collection);

                QF.add('template-listify', `${atom.name}List`, config.listify);
            }
        }

        if (config.edit) {
            QF.add('route', `${routePathPrefix}/:_id/edit`, {
                name: `${routeNamePrefix}.edit`,
                template: `${atom.name}Edit`,
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
            QF.add('route', `${routePathPrefix}/create`, {
                name: `${routeNamePrefix}.create`,
                template: `${atom.name}Create`
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
                type: [String]
            },
            list: {
                type: String,
                optional: true
            },
            listify: {
                type: Object,
                blackbox: true,
                optional: true
            },
            formify: {
                type: Object,
                blackbox: true,
                optional: true
            },
            create: {
                type: String,
                optional: true
            },
            edit: {
                type: String,
                optional: true
            }
        }
    }

    requires() {
        return ['route']
    }
};

QF.plugin('template-crudify', plugin);