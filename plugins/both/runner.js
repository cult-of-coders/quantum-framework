let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        atom.runner = new config.definition;

        return atom.runner.run;
    }

    validate(config) {
        if (!config.prototype.run) {
            throw `When you define a runner you need to have the run property available`
        }
    }

    schema() {
        return {
            definition: {
                type: Function
            }
        }
    }
};

QF.plugin('runner', plugin);