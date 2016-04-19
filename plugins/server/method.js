let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;

        let checkRoles = function (userId) {
            if (config.allowedRoles && config.allowedRoles.length) {
                Quantum.Roles.check(userId, config.allowedRoles);
            }
        };

        let methods = {};

        methods[atom.name] = function(...args) {
            checkRoles(this.userId);
            let run = config.handler.bind(this);

            return run(...args);
        };

        Meteor.methods(methods)
    }
    schema() {
        return {
            allowedRoles: {
                type: [String],
                optional: true
            },
            handler: {
                type: Function
            }
        }
    }
};

Quantum.instance.plugin('method', plugin);