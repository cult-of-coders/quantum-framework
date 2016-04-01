let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        Template[atom.name].viewmodel(atom.config);
    }
};

Q('template').extend({
    model: {
        type: Object,
        optional: true,
        blackbox: true
    }
}, function(atom) {
    let config = atom.config;

    if (!config.model) return;

    QF.add('viewmodel', atom.name, config.model);
});


Quantum.instance.plugin('viewmodel', plugin);