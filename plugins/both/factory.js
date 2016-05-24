import {Factory} from './lib/factory.js';

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        var config = atom.config;

        // QF.use('service', 'atom', true).extend({})
        atom.extend = function(object) {
            _.extend(config.definition.prototype, object);
        };

        return new Factory(config.definition);
    }

    schema() {
        return {
            'definition': {
                type: Function
            }
        }
    }
};

Quantum.instance.plugin('factory', plugin);
