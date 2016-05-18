// Write your package code here!
let helperClass = class {
    constructor(config) {
        this._config = config;
        this.utils = QF.use('service', 'quantum.utils');
    }
    update(doc) {
        let config = this._config;

        this.doc = doc;
        this.id = config.formId;
        this.schema = this.utils.getSchema(config.schema);
        this.type = (this.doc && this.doc._id) ? 'method-update' : 'method';

        let methodSuffix = (this.doc && this.doc._id) ? 'update' : 'insert';
        this.meteormethod = `${config.methodsPrefix}.${methodSuffix}`;
    }
};

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;

        if (!config.formId) {
            config.formId = atom.name;
        }

        let helper = new helperClass(atom.config);

        Template[atom.name].onCreated(function () {
            this._formHelper = helper;
        });

        Template[atom.name].helpers({
            formHelper: function (doc) {
                let formHelper = Template.instance()._formHelper;
                formHelper.update(doc);

                return formHelper;
            }
        });

        if (atom.config.events) {
            let hooks = {};
            hooks[config.formId] = atom.config.events;
            AutoForm.hooks(hooks);
        }
    }

    schema() {
        return {
            methodsPrefix: {
                type: String
            },
            formId: {
                type: String,
                optional: true
            },
            schema: {
                type: null,
                blackbox: true,
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

Quantum.instance.plugin('template').extend({
    'formify': {
        type: Object,
        blackbox: true,
        optional: true
    }
}, function (atom) {

    if (atom.config.formify) {
        let templateName = atom.name;
        QF.add('template-formify', atom.name, atom.config.formify);
    }
});

Quantum.instance.plugin('template-formify', plugin);