class Paginator
    subscription: null
    collection: null

    @pagerOptions:
        pageSize: 10
        subscriptionName: ''
        countMethod: ''

    filters:
        main: {}
        options: {}

    constructor: (@collection, pagerOptions, filters) ->
        @pagerOptions = _.clone Paginator.pagerOptions
        _.extend @pagerOptions, pagerOptions

        @currentPage = new ReactiveVar(0)
        @total = new ReactiveVar(0)

        @constructFilters(filters)

    init: (tpl) ->
        tpl.autorun =>
            Meteor.call @pagerOptions.countMethod, @getFilters('main'), @getFilters('options'), (err, data) =>
                @updateTotal data

            if @subscription then @subscription.stop()
            @subscription = tpl.subscribe @pagerOptions.subscriptionName, @getFilters('main'), @getOptions()

    getFilters: (context) -> @filters[context].get()
    getOptions: ->
        options = @getFilters 'options'
        _.extend options,
            limit: @pagerOptions.pageSize
            skip: @pagerOptions.pageSize * @currentPage.get()

        return options
    constructFilters: (filters) ->
        unless filters.main instanceof ReactiveVar
            filters.main = new ReactiveVar(filters.main)

        unless filters.options instanceof ReactiveVar
            filters.options = new ReactiveVar(filters.options)

        @filters = filters

    reset: -> @currentPage.set(0)

    updateTotal: (total) ->
        @total.set total

    findDefault: -> @find @getFilters('main'), @getFilters('options')
    find: (query = {}, options = {}) ->
        cursor = @collection.find query, options

        cursor.currentPage = => @currentPage.get()
        cursor.totalPages = => Math.ceil(@total.get() / @pagerOptions.pageSize)

        cursor.goToPage = (pageNumber) =>
            if pageNumber >= 0 and pageNumber < cursor.totalPages()
                @currentPage.set(pageNumber)

        return cursor

Quantum.instance.add 'service', 'quantum.paginator',
    definition: Paginator
    factory: true