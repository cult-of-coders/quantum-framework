import {_} from 'underscore';

QF.add('service', 'query', {
    factory: true,
    definition: class {
        constructor(collectionName, body) {
            this.collectionName = collectionName;
            this.body = body;
        }

        init(options = {}) {
            this.options = options;
            options.params = options.params || {};
            this.params(options.params);

            this._subscribe();
        }

        stop() {
            if (this.activeComputation) {
                this.activeComputation.stop();
            }
            if (this.activeSubscription) {
                this.activeSubscription.stop();
            }
        }

        /**
         * Getter & Setter + Reactivity
         */
        params(name, value) {
            if (name === undefined) { return this.params; }

            if (typeof(name) === 'object') {
                _.each(_.keys(name), k => {
                    this.params(k, name[k]);
                });
                return this;
            }

            if (value === undefined) {
                return this.params[name].get();
            }

            if (value instanceof ReactiveVar) {
                this.params[name] = value;
            } else {
                if (!this.params[name]) {
                    this.params[name] = new ReactiveVar(value);
                } else {
                    this.params[name].set(value);
                }
            }

            return this;
        }

        _subscribe() {
            let options = this.options;
            let runner = options.template ? options.template : Meteor;

            runner.autorun(c => {
                this.activeComputation = c;
                // might need to stop it.
                if (this.activeSubscription) {
                    this.activeSubscription.stop();
                }

                this.activeSubscription = runner.subscribe('query', this.collectionName, this._getPreparedBody());
            })
        }

        _getPreparedBody() {
            let body = _.clone(this.body, true);
            this._applyFilterRecursive(body);

            return body;
        }

        _applyFilterRecursive(data) {
            if (data.$filter) {
                data.$filters = data.$filters || {};
                data.$options = data.$options || {};

                data.$filter({
                    filters: data.$filters,
                    options: data.$options,
                    params: this.params.bind(this)
                });

                data.$filter = undefined;
            }

            _.each(data, (key, value) => {
                if (_.isObject(value)) {
                    return this._applyFilterRecursive(value);
                }
            })
        }
    }
});