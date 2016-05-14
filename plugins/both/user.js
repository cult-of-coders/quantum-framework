let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        new Quantum.User(atom.config);
    }

    configure(config) {
        let roles = QF.use('service', 'roles');
        
        if (config.roleHierarchy) {
            roles.storeHierarchy(config.roleHierarchy);
        }

        if (config.schema) {
            QF.add('schema', 'user', _.extend(this.defaultUserSchema(), config.schema));
        }

        if (config.collection) {
            config.collection.existingCollection = Meteor.users;
            config.collection.schema = 'user';

            QF.add('collection', 'user', config.collection);
        }

        if (Meteor.isServer) {
            config.selfFields = config.selfFields || {};
            config.selfFields.roles = 1;

            Meteor.publish(null, function() { // auto publish these fields
                if (this.userId) {
                    return Meteor.users.find({_id: this.userId},  {fields: config.selfFields});
                } else {
                    this.ready();
                }
            })
        }
    }

    configSchema() {
        return {
            roleHierarchy: {
                type: Object,
                optional: true,
                blackbox: true
            },
            collection: {
                type: Object,
                optional: true,
                blackbox: true
            },
            schema: {
                type: Object,
                optional: true,
                blackbox: true
            },
            selfFields: {
                type: Object,
                blackbox: true,
                optional: true
            }
        }
    }

    /**
     * Q('schema user', _.extend(Q('user').defaultUserSchema(), {
     *      yourFieldSchemas: {}
     * });
     */
    defaultUserSchema() {
        return {
            emails: {
                type: Array,
                optional: true
            },
            'emails.$': {
                type: Object
            },
            'emails.$.address': {
                type: String,
                regEx: SimpleSchema.RegEx.Email,
                label: 'Email Address'
            },
            'emails.$.verified': {
                type: Boolean,
                optional: true
            },
            roles: {
                type: Any,
                optional: true
            },
            services: {
                type: Object,
                optional: true,
                blackbox: true
            },
            createdAt: {
                type: Date,
                optional: true
            },
            username: {
                type: String,
                optional: true
            },
            profile: {
                type: Object,
                optional: true,
                blackbox: true
            }
        }
    };

    requires() {
        return ['schema', 'collection'];
    }
};

QF.plugin('user', plugin);