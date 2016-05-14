let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return atom.config;
    }

    validate(config) {
        let allowedWhens = ['before.update', 'before.insert', 'before.remove', 'after.update', 'after.insert', 'after.remove'];

        _.each(config, (handler, when) => {
            check(when, String);
            if (!_.contains(allowedWhens, when)) {
                throw new Meteor.Error('invalid-config', `${when} is not a valid event. Allowing only: ${allowedWhens.join(', ')}`);
            }

            check(handler, Function);
        });
    }

    /**
     * Attach the behavior to a collection atom
     *
     * @param collectionName
     * @param behavior
     */
    attachBehavior(collectionName, behavior) {
        let config = this.get(behavior).config;
        let collection = QF.use('collection', collectionName);

        _.each(config, (when, handler) => {
            let [mainWhen, mutationType] = config.when.split('.');
            collection[mainWhen][mutationType](config.handler);
        });
    }
};

QF.plugin('collection-behavior', plugin);

Q('collection-hooks').extend({
    behaviors: {
        type: [String],
        optional: true
    }
}, function(atom) {
    let config = atom.config;
    if (config.behaviors) {
        _.each(config.behaviors, (behaviorName) => {
            QF.use('collection-behavior').attachBehavior(atom.name, behaviorName);
        })
    }
});

Q('collection').extend({
    behaviors: {
        type: [String],
        optional: true
    }
}, function(atom) {
    let config = atom.config;
    if (config.behaviors) {
        _.each(config.behaviors, (behaviorName) => {
            QF.use('collection-behavior').attachBehavior(atom.name, behaviorName);
        })
    }
});