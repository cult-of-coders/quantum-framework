let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        Template[atom.name].viewmodel(atom.config);
    }
};

Quantum.instance.plugin('viewmodel', plugin);