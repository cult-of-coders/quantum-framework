var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return atom.config;
    }

    validate(config) {
        let allowedWhens = ['onCreated', 'onRendered', 'onDestroyed', 'events', 'helpers'];
        _.each(config, (handler, when) => {
            check(when, String);
            if (!_.contains(allowedWhens, when)) {
                throw new Meteor.Error('invalid-config', `${when} is not a valid event. Allowing only: onCreated, onRendered, onDestroyed, events, helpers`);
            }
        });
    }

    attachBehavior(templateName, behaviorName) {
        let config = this.get(behaviorName).config;
        let tpl = Template[templateName];

        _.each(config, (handler, when) => {
            tpl[when](handler);
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