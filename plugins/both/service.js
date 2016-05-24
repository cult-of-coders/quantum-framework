import {Factory} from './lib/factory.js';

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        var config = atom.config;

        // QF.use('service', 'atom', true).extend({})
        atom.extend = function(object) {
            _.extend(config.definition.prototype, object);
        };

        if (config.definition instanceof Function) {
            if (config.factory) {
                return new Factory(config.definition);
            }

            return new config.definition;
        }

        throw 'The service plugin needs either a "prototype" either an "object" as options'
    }

    schema() {
        return {
            'definition': {
                type: Function
            },
            'factory': {
                type: Boolean,
                defaultValue: false,
                optional: true
            }
        }
    }
};

Quantum.instance.plugin('service', plugin);

