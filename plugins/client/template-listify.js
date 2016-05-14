// Write your package code here!

let plugin = class extends Quantum.Model.Plugin {
    build(atom) {
        let config = atom.config;

        let collection = Quantum.instance.use('collection', config.collection);
        let subscriptionName = config.collection; // collection-exposure uses the same

        let filters = {}, options = {};
        if (config.filters) { filters = config.filters() }
        if (config.options) { options = config.options() }

        let onCreated = function () {
            this.listify = {};
            this.listify.filters = new ReactiveVar(filters);
            this.listify.options = new ReactiveVar(options);
            this.listify.extend = (value, options) => {
                let object = _.extend(this.listify[value].get(), options);
                this.listify[value].set(object)
            };

            this.listify.paginator = Quantum.instance.use('service', 'quantum.paginator').build(collection, {
                subscriptionName: subscriptionName,
                countMethod: `${subscriptionName}.count`,
                pageSize: config.itemsPerPage
            }, {
                main: this.listify.filters,
                options: this.listify.options
            });

            this.listify.paginator.init(this);
        };

        let helpers = {};
        helpers[config.itemsVariable] = function () {
            let tpl = Template.instance();

            return tpl.listify.paginator.find(tpl.listify.filters.get(), tpl.listify.options.get());
        };

        if (!Template[atom.name]) {
            throw `Template with name ${atom.name} does not exist. Please add it before this loads.`
        }

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
                defaultValue: 'items',
                optional: true
            },
            itemsPerPage: {
                type: Number,
                defaultValue: 10,
                optional: true
            }
        };
    }

    executionContext() {
        return 'instant';
    }
};

Quantum.instance.plugin('template').extend({
    'listify': {
        type: Object,
        blackbox: true,
        optional: true
    }
}, function (atom) {
    if (atom.config.listify) {
        QF.add('template-listify', atom.name, atom.config.listify);
    }
});

Quantum.instance.plugin('template-listify', plugin);


