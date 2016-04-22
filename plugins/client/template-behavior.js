var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return atom.config;
    }

    schema() {
        return {
            'when': {
                type: String,
                defaultValue: 'onRendered',
                allowedValues: ['onRendered', 'onCreated'],
                optional: true
            },
            'handler': {
                type: Function
            }
        }
    }
};

Quantum.instance.plugin('template').extend({
    'behaviors': {
        type: [String],
        defaultValue: [],
        optional: true
    }
}, function (atom) {
    let config = atom.config;
    let templateName = atom.name;

    if (config.behaviors && config.behaviors.length) {
        _.each(config.behaviors, (behaviorName) => {
            let behavior = Quantum.instance.use('template-behavior', behaviorName);

            if (!behavior.when || behavior.when == 'onRendered') {
                Template[templateName].onRendered(behavior.handler);
            } else if (behavior.when == 'onCreated') {
                Template[templateName].onCreated(behavior.handler);
            }
        });
    }
});

Quantum.instance.plugin('template-behavior', plugin);