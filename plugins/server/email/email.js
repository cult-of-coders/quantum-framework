let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return Q('service quantum.email.atom').build(atom.config.reader || this.config('reader'), atom);
    }

    schema() {
        return Q('schema quantum.email.atom');
    }

    configSchema() {
        return {
            from: {type: String},
            less: {type: String, optional: true},
            layout: {type: String, optional: true},
            test: {type: null, optional: true, blackbox: true},
            helpers: {type: Object, blackbox: true, optional: true},
            reader: {type: Object, blackbox: true}
        }
    }
};

QF.plugin('email', plugin);