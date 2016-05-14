var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return atom.config;
    }

    validate(config) {
        let allowedWhens = ['onCreated', 'onRendered', 'onDestroyed'];
        _.each(config, (handler, when) => {
            check(when, String);
            if (!_.contains(allowedWhens, when)) {
                throw new Meteor.Error('invalid-config', `${when} is not a valid event. Allowing only: onCreated, onRendered, onDestroyed`);
            }

            check(handler, Function);
        });
    }

    attachBehavior(templateName, behaviorName) {
        let behavior = this.get(behaviorName);
        let tpl = Template[templateName];

        _.each(when, (handler, when) => {
            tpl[when].call(handler);
        });
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
    let behaviorPlugin = QF.plugin('template-behavior');

    if (config.behaviors && config.behaviors.length) {
        _.each(config.behaviors, (behaviorName) => {
            behaviorPlugin.attachBehavior(templateName, behaviorName);
        });
    }
});

QF.plugin('template-behavior', plugin);