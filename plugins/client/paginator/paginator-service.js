let Paginator = class {
    constructor(collection, pagerOptions, filters) {
        this.collection = collection;
        this.subscription = null;
        this.filters = {main: {}, options: {}};

        this.pagerOptions = this.getDefaultOptions();
        _.extend(this.pagerOptions, pagerOptions);

        this.currentPage = new ReactiveVar(0);
        this.total = new ReactiveVar(0);
        this.constructFilters(filters)
    }

    getDefaultOptions() {
        return {
            pageSize: 10,
            subscriptionName: '',
            countMethod: ''
        }
    }

    init(tpl) {
        tpl.autorun(() => {
            this.currentPage.get();

            Meteor.call(this.pagerOptions.countMethod, this.getFilters('main'), this.getFilters('options'), (err, data) => {
                this.updateTotal(data);
            });

            if (this.subscription) {
                this.subscription.stop();
            }

            var methodName = this.collection._name + '.find_ids';
            Meteor.call(methodName, this.getFilters('main'), this.getPaginationOptions(), (err, ids) => {
                this.subscription = tpl.subscribe(
                    this.pagerOptions.subscriptionName, {_id: {$in: ids}}
                );
            });
        })
    }

    getFilters(context) {
        return this.filters[context].get();
    }

    getPaginationOptions() {
        let options = this.getFilters('options');

        _.extend(options, {
            limit: this.pagerOptions.pageSize,
            skip: this.pagerOptions.pageSize * this.currentPage.get()
        });

        return options
    }

    constructFilters(filters) {
        if (!(filters.main instanceof ReactiveVar))
            filters.main = new ReactiveVar(filters.main);

        if (!(filters.options instanceof ReactiveVar))
            filters.options = new ReactiveVar(filters.options);

        this.filters = filters
    }

    reset() {
        this.currentPage.set(0)
    }

    updateTotal(total) {
        this.total.set(total);
    }

    findDefault() {
        this.find(this.getFilters('main'), this.getFilters('options'));
    }

    find(query = {}, options = {}) {
        let cursor = this.collection.find(query, options);

        cursor.currentPage = () => {
            return this.currentPage.get();
        };

        cursor.totalPages = () => {
            return Math.ceil(this.total.get() / this.pagerOptions.pageSize);
        };

        cursor.goToPage = (pageNumber) => {
            if (pageNumber >= 0 && pageNumber < cursor.totalPages())
                this.currentPage.set(pageNumber)
        };

        return cursor
    }
}

QF.add('service', 'quantum.paginator', {
    definition: Paginator,
    factory: true
});
