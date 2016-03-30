let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        let collection = Quantum.instance.use('collection', atom.name);

        _.each(config, (hooks, context) => {
            _.each(hooks, (handler, when) => {
                if (typeof(handler) === 'function') {
                    collection[context][when](handler);
                }

                collection[context][when]((userId, doc) => {
                    let eventObject = {
                        doc: doc,
                        userId: doc
                    };

                    QF.emit(`${atom.name}.${context}.${when}`, eventObject);
                });
            })
        });
    }

    executionContext() {
        return 'boot';
    }
};

Quantum.instance.plugin('collection-hooks', plugin);