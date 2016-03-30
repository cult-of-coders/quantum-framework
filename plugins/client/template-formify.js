// Write your package code here!
let helperClass = class {
    constructor(config) {
        this._config = config;
    }
    update(doc) {
        let config = this._config;

        this.id = config.formId;
        this.schema = Quantum.instance.use('schema', this._config.schema);
        this.type = (this.doc && this.doc._id) ? 'method-update' : 'method';
        let methodSuffix = (this.doc && this.doc._id) ? 'update' : 'insert';
        this.meteormethod = `${this._config.methodsPrefix}.${methodSuffix}`;
    }
};

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let helper = new helperClass(atom.config);

        Template[atom.name].onCreated(function () {
            this._form_helper = helper;
        });

        Template[atom.name].helpers({
            formHelper: function (doc) {
                let formHelper = Template.instance()._form_helper;
                formHelper.update(doc);

                return formHelper;
            }
        });

        if (atom.config.events) {
            let hooks = {};
            hooks[helper.id] = atom.config.events;
            AutoForm.hooks(hooks);
        }
    }

    schema() {
        return {
            methodsPrefix: {
                type: String
            },
            formId: {
                type: String
            },
            schema: {
                type: String,
                optional: true
            },
            events: {
                type: Object,
                blackbox: true,
                optional: true
            }
        }
    }
};

Quantum.instance.plugin('template-formify', plugin);