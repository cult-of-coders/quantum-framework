let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        new Quantum.User(atom.config);
    }

    configure(config) {
        let roles = QF.use('service', 'roles');
        
        if (config.roleHierarchy) {
            roles.storeHierarchy(config.roleHierarchy);
        }

        if (config.collection) {
            config.collection.existingCollection = Meteor.users;
            config.collection.schema = 'user';

            QF.add('collection', 'user', config.collection);
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
            }
        }
    }

    /**
     * Q('schema user', _.extend(Q('schema').defaultUserSchema(), {
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
            confirmationToken: {
                type: String,
                optional: true
            },
            createdAt: {
                type: Date,
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