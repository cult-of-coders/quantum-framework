Quantum.instance.add 'template',  'QuantumPaginator',
    helpers:
        currentPage: -> @currentPage() + 1
        showUI: -> @totalPages() > 1
        isCurrentPageFirst: -> @currentPage() is 0
        isCurrentPageLast: -> @currentPage() is @totalPages() - 1
    events:
        'click .paginator-prev': -> @goToPage @currentPage() - 1
        'click .paginator-next': -> @goToPage @currentPage() + 1

