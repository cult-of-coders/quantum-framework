let plugin = class extends Quantum.Model.Plugin {
    get defaultEvents() {
        return ['click', 'change', 'focus', 'submit', 'load'];
    }

    build(atom) {
        let model = atom.config;
        let modelEvents = model._events || this.defaultEvents;

        let handler = function(attr) {
            return function(e, tpl) {
                let $el = $(e.currentTarget);
                let modelMethod = $el.attr(attr);
                model[modelMethod](e, tpl, $el);
            }
        };

        let map = {};
        _.each(modelEvents, e => {
            map[`${e} [q-${e}]`] = handler(`q-${e}`);
        });

        Template[atom.name].events(map);
    }

    // q-click="doSomething"
};

// "
Q('template').extend({
    handlers: {
        type: Object,
        optional: true,
        blackbox: true
    }
}, function(atom) {
    let config = atom.config;

    if (!config.model) return;

    QF.add('template-handler', atom.name, config);
});


Quantum.instance.plugin('template-handler', plugin);