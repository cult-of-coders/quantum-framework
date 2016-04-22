let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return atom.config;
    }
    schema() {
        return {
            when: { // 'before.insert'
                type: String
            },
            handler: {
                type: Function
            }
        }
    }
    attachBehavior(collection, behavior) {
        let config = this.get(behavior).config;

        let [when, context] = config.when.split('.');

        QF.use('collection', collection)[when][context](config.handler);
    }
};

QF.plugin('collection-behavior', plugin);

if (QF.plugin('collection-hooks')) {
    Q('collection-hooks').extend({
        behaviors: {
            type: [String],
            optional: true
        }
    }, function(atom) {
        let config = atom.config;
        if (config.behaviors && config.behaviors.length) {
            _.each(config.behaviors, (behavior) => {
                QF.use('collection-behavior').attachBehavior(atom.name, behavior);
            })
        }
    });
}
