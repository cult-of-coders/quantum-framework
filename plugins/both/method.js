let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        console.log(config);
        let roles = QF.use('service', 'roles');
        let utils = QF.use('service' , 'quantum.utils');

        let checkRoles = function (userId) {
            if (config.allowedRoles && config.allowedRoles.length) {
                roles.check(userId, config.allowedRoles);
            }
        };

        let checkSchema = function (...args) {
            if (!config.schema) return;

            let dataToValidate = args[0];
            let schema = utils.getSchema(config.schema);

            schema.validate(dataToValidate);
        };

        let methods = {};

        methods[atom.name] = function(...args) {
            checkRoles(this.userId);
            checkSchema(...args);

            let run = config.handler.bind(this);

            return run(...args);
        };

        Meteor.methods(methods);

        return new class {
            call(args, callback) {
                Meteor.apply(atom.name, [args], config.options, callback);
            }
        }
    }

    schema() {
        return {
            allowedRoles: {
                type: [String],
                optional: true
            },
            handler: {
                type: Function
            },
            schema: {
                type: null,
                blackbox: true,
                optional: true
            },
            options: {
                type: Object,
                blackbox: true,
                defaultValue: {
                    returnStubValue: true,
                    throwStubExceptions: true
                }
            }
        }
    }
};

Quantum.instance.plugin('method', plugin);