Quantum.instance.add('schema', 'quantum.collection_security.firewall', {
    insert: {
        type: Function,
        optional: true
    },
    update: {
        type: Function,
        optional: true
    },
    remove: {
        type: Function,
        optional: true
    }
});

var plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let collection = Quantum.instance.use('collection', atom.name);

        let config = atom.config;

        if (config.allow) {
            collection.allow(firewall.allow);
        }
        if (config.deny) {
            collection.deny(firewall.deny);
        }
    }

    schema() {
        return {
            'allow': {
                type: Quantum.instance.use('schema', 'quantum.collection_security.firewall'),
                optional: true
            },
            'deny': {
                type: Quantum.instance.use('schema', 'quantum.collection_security.firewall'),
                optional: true
            }
        }
    }
};

Quantum.instance.plugin('collection-security', plugin);