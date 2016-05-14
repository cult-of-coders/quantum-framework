class Enum {
    constructor(elements) {
        this.elements = elements;
    }

    selectize() {
        return _.map(this.elements, (label, value) => {
            return {
                label: label,
                value: value
            }
        })
    }

    values() {
        return _.keys(this.elements);
    }

    labels() {
        return _.values(this.elements);
    }

    exists(k) {
        return this.elements[k] !== undefined;
    }
}

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;

        return new Enum(atom.config);
    }
};

QF.plugin('enum', plugin);