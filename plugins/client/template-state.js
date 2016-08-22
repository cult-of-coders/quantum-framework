// Write your package code here!

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        var config = atom.config;
        let tpl = Template[atom.name];

        tpl.onCreated(function () {
            this.state = new ReactiveDict();
            this.state.setDefault(config);
        });

        tpl.helpers({
            state(key) {
                let tpl = Template.instance();
                if (key === undefined) {
                    return tpl.state;
                }

                return tpl.state.get(key);
            }
        })
    }

    executionContext() {
        return 'instant';
    }
};

Quantum.instance.plugin('template').extend({
    'state': {
        type: Object,
        blackbox: true,
        optional: true
    }
}, function (atom) {
    if (atom.config.state) {
        QF.add('template-state', atom.name, atom.config.state);
    }
}, 'pre:build');

Quantum.instance.plugin('template-state', plugin);