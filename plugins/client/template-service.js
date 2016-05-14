// Write your package code here!
let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        var config = atom.config;
        let tpl = Template[atom.name];

        QF.add('service', atom.name, {
            definition: config.definition,
            factory: true
        });

        tpl.onCreated(function () {
            this.service = QF.use('service', atom.name).build(this);
            this.service.tpl = this;
        });
    }

    requires() {
        return ['service'];
    }

    executionContext() {
        return 'instant';
    }
};

Quantum.instance.plugin('template-service', plugin);



