let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        return Q('service quantum.email.atom').build(Assets, atom);
    }

    schema() {
        return Q('schema quantum.email.atom');
    }

    configSchema() {
        return {
            from: {type: String},
            scss: {type: String, optional: true},
            layout: {type: String, optional: true},
            test: {type: Any, optional: true},
            helpers: {type: Object, blackbox: true, optional: true}
        }
    }

    configure() {
        this.Assets = Assets;
    }
};

QF.plugin('email', plugin);