let plugin = class extends Quantum.Model.Plugin {
    get allowedEvents() {
        return ['before.update', 'before.insert', 'before.remove', 'after.update', 'after.insert', 'after.remove', 'before.upsert'];
    }

    build(atom) {
        let config = _.clone(atom.config),
            collectionName = atom.name;

        let dispatchEvents = config.dispatchEvents === undefined ? true : config.dispatchEvents;
        delete config.dispatchEvents;

        let collection = Quantum.instance.use('collection', collectionName);

        if (dispatchEvents) {
            this.hookEvents(atom.name, collection);
        }

        _.each(config, (handler, hook) => {
            let [when, mutator] = hook.split('.');

            collection[when][mutator]((userId, doc, fieldNames, modifier, options) => {
                handler(userId, doc, fieldNames, modifier, options);
            });
        });
    }

    validate(config) {
        _.each(config, (handler, option) => {
            if (option === 'dispatchEvents') return check(handler, Boolean);

            check(option, String);
            if (!_.contains(this.allowedEvents, option)) {
                throw new Meteor.Error('invalid-config', `${option} is not a valid event. Allowing only: ${this.allowedEvents.join(', ')}`);
            }

            check(handler, Function);
        });
    }

    hookEvents(prefix, collection) {
        _.each(this.allowedEvents, (event) => {
            let [when, mutator] = event.split('.');

            collection[when][mutator]((userId, doc, fieldNames, modifier, options) => {
                let eventObject = {
                    doc: doc,
                    userId: userId
                };

                if (mutator == 'update' || mutator == 'upsert') {
                    eventObject.updateInfo = {
                        fieldNames: fieldNames,
                        modifier: modifier,
                        options: options
                    };
                }

                QF.emit(`${prefix}.${when}.${mutator}`, eventObject);
            });
        })
    }

    executionContext() {
        return 'boot';
    }
};

QF.plugin('collection').extend({
    'hooks': {
        type: Object,
        blackbox: true,
        optional: true
    }
}, function (atom) {
    if (atom.config.hooks) {
        QF.add('collection-hooks', atom.name, atom.config.hooks);
    }
});

Quantum.instance.plugin('collection-hooks', plugin);