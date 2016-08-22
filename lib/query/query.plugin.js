let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        let builder = QF.use('service', 'query-builder');

        return new class {
            build() {
                return builder.build(config.collection, config.request);
            }
        }
    }

    schema() {
        return {
            collection: {
                type: String
            },
            request: {
                type: Object,
                blackbox: true
            }
        }
    }
};

QF.plugin('query', plugin);

let mixinPlugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return atom.config;
    }
};

QF.plugin('query-mixin', mixinPlugin);
