import './collection-links.link.schema.js';
import './collection-links.link.service.js';

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        atom.linkStore = {};
        let collection = QF.use('collection', atom.name);

        _.extend(collection, {
            getLink(name) { return atom.linkStore[name]; }
        });

        _.each(atom.config, (linkConfig, linkName) => {
            let linkService = Q('service quantum.collection-links.link').build(atom.name, linkName, linkConfig);

            atom.linkStore[linkName] = {
                config: linkConfig,
                service: linkService
            };
        });

        return atom.linkStore;
    }
};

QF.plugin('collection').extend({
    'links': {
        type: Object,
        blackbox: true,
        optional: true
    }
}, function (atom) {
    let config = atom.config;
    if (config.links) {
        QF.add('collection-links', atom.name, config.links);
    }
});

QF.plugin('collection-links', plugin);


