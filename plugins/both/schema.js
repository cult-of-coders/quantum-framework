var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return new SimpleSchema(atom.config)
    }
};

Quantum.instance.plugin('schema', plugin);
