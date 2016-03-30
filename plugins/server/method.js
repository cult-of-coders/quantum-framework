let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;

        let checkRoles = function (userId) {
            if (config.allowedRoles && config.allowedRoles.length) {
                Quantum.Roles.check(this.userId, config.allowedRoles);
            }
        };

        let methods = {};

        methods[atom.name] = (...args) => {
            checkRoles(this.userId);
            let run = config.handler.bind(this)
            run(...args);
        };

        Meteor.methods(methods)
    }
};

Quantum.instance.plugin('method', plugin);