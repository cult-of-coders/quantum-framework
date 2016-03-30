let factory = class {
    constructor(_class) {
        this._class = _class;
    }
    build(...args) {
        return new this._class(...args);
    }
};

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        if (atom.config.definition instanceof Function) {
            if (atom.config.factory) {
                return new factory(atom.config.definition);
            }

            return new atom.config.definition;
        }

        if (atom.config.object instanceof Object) {
            return atom.config.object
        }

        throw 'The service plugin needs either a "prototype" either an "object" as options'
    }

    schema() {
        return {
            'definition': {
                type: Function,
                optional: true
            },
            'object': {
                type: Object,
                optional: true,
                blackbox: true
            },
            'factory': {
                type: Boolean,
                defaultValue: false
            }
        }
    }
};

Quantum.instance.plugin('service', plugin);