var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return atom.config;
    }
};

Quantum.instance.plugin('datastore', plugin);
