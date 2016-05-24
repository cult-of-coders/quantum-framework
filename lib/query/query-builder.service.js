import {_} from 'underscore';

QF.add('service', 'query-builder', {
    factory: true,
    definition: class {
        set template(tpl) {
            this.options = this.options || {};
            this.options.template = tpl;
        }

        constructor(collectionName, body) {
            this.collectionName = collectionName;
            this.body = body;
            this.options = {
                params: {}
            };
        }

        /**
         * Initialize the query
         * @param options
         */
        init(options = {}) {
            _.extend(this.options, options);
            this.params(options.params);

            if (Meteor.isClient) {
                this._subscribe();
            }
        }

        /**
         * Works client-side only
         * @returns {*|{content}|any|*|{content}|any}
         */
        fetch() {
            if (this.ready()) {
                let options = this.preparedBody.$options || {};
                let filters = this.preparedBody.$filters || {};

                return QF.use('collection', this.collectionName).find(filters, options).fetch();
            }

            return [];
        }

        /**
         * Just a helper method
         */
        fetchOne() {
            return _.first(this.fetch());
        }

        /**
         * Client-side only
         * @returns {any|*}
         */
        ready() {
            return (this.activeSubscription && this.activeSubscription.ready());
        }

        /**
         * Client-side only.
         */
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
            if (name === undefined) {
                return this.params;
            }

            if (typeof(name) === 'object') {
                _.each(_.keys(name), k => {
                    this.params(k, name[k]);
                });
                return this;
            }

            if (value === undefined) {
                return this.params[name] ? this.params[name].get() : undefined;
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

        /**
         * Client-side only
         * @private
         */
        _subscribe() {
            let options = this.options;
            let runner = options.template ? options.template : Meteor;

            runner.autorun(c => {
                this.activeComputation = c;
                // might need to stop it.
                if (this.activeSubscription) {
                    this.activeSubscription.stop();
                }

                this.preparedBody = this._getPreparedBody();
                this.activeSubscription = runner.subscribe('quantum.query', this.collectionName, this.preparedBody);
            })
        }

        /**
         * @private
         */
        _getPreparedBody() {
            let body = _.clone(this.body, true);
            this._applyMixinsRecursive(body);
            this._applyFilterRecursive(body);

            return body;
        }

        /**
         * @param data
         * @private
         */
        _applyMixinsRecursive(data) {
            if (data.$mixin) {
                let mixins = data.$mixin;
                if (!_.isArray(mixins)) mixins = [mixins];

                _.each(mixins, m => {
                    _.extend(data, QF.use('query-mixin', m));
                });

                delete data.$mixin;
            }

            _.each(data, (value, key) => {
                if (_.isObject(value)) {
                    return this._applyMixinsRecursive(value);
                }
            });
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

            _.each(data, (value, key) => {
                if (_.isObject(value)) {
                    return this._applyFilterRecursive(value);
                }
            })
        }
    }
});