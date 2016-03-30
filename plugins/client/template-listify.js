// Write your package code here!

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;
        let collection = Quantum.instance.use('collection', config.collection);
        let subscriptionName = config.collection;

        let filters = {}, options = {};
        if (config.filters) { filters = config.filters() }
        if (config.options) { options = config.options() }

        let onCreated = function () {
            this._list_filters = new ReactiveVar(filters);
            this._list_options = new ReactiveVar(options);

            this._paginator = Quantum.instance.use('service', 'quantum.paginator').build(collection, {
                subscriptionName: subscriptionName,
                countMethod: `${subscriptionName}.count`,
                pageSize: config.itemsPerPage
            }, {
                main: this._list_filters,
                options: this._list_options
            });

            this._paginator.init(this);
        };

        let helpers = {};
        helpers[config.itemsVariable] = function () {
            let tpl = Template.instance();

            return tpl._paginator.find(tpl._list_filters.get(), tpl._list_options.get());
        };

        Template[atom.name].helpers(helpers);
        Template[atom.name].onCreated(onCreated);
    }

    schema() {
        return {
            collection: {
                type: String
            },
            filters: {
                type: Function,
                optional: true
            },
            options: {
                type: Function,
                optional: true
            },
            itemsVariable: {
                type: String,
                defaultValue: 'items'
            },
            itemsPerPage: {
                type: Number,
                defaultValue: 10
            }
        };
    }

    executionContext() {
        return 'boot';
    }
};

Quantum.instance.plugin('template-listify', plugin);