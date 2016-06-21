var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        var config = atom.config;
        var templateName = atom.name;
        let tpl = Template[templateName];

        if (config.helpers) {
            tpl.helpers(config.helpers)
        }
        if (config.events) {
            tpl.events(config.events)
        }
        if (config.onCreated) {
            tpl.onCreated(config.onCreated)
        }
        if (config.onRendered) {
            tpl.onRendered(config.onRendered);
        }
        if (config.onDestroyed) {
            tpl.onDestroyed(config.onDestroyed);
        }

        Quantum.Model.Utils.eventify(Template[templateName]);

        return Template[templateName];
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
            },
            'onDestroyed': {
                type: Function,
                optional: true
            },
            'state': {
                type: Object,
                blackbox: true,
                optional: true
            }
        }
    }
};

Quantum.instance.plugin('template', plugin);