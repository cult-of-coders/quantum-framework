var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        var config = atom.config;
        var templateName = atom.name;

        if (config.helpers) {
            Template[templateName].helpers(config.helpers)
        }
        if (config.events) {
            Template[templateName].events(config.events)
        }
        if (config.onCreated) {
            Template[templateName].onCreated(config.onCreated)
        }
        if (config.onRendered) {
            Template[templateName].onRendered(config.onRendered);
        }
    }

    schema() {
        return {
            'helpers': {
                type: Object,
                optional: true,
                blackbox: true
            },
            'events': {
                type: Object,
                optional: true,
                blackbox: true
            },
            'onCreated': {
                type: Function,
                optional: true
            },
            'onRendered': {
                type: Function,
                optional: true
            }
        }
    }
};

Quantum.instance.plugin('template', plugin);