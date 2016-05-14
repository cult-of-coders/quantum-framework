QF.add('template', 'QuantumPaginator', {
    helpers: {
        currentPage() {
            return this.currentPage() + 1
        },
        showUI() {
            return this.totalPages() > 1
        },
        isCurrentPageFirst() {
            return this.currentPage() === 0
        },
        isCurrentPageLast() {
            return this.currentPage() === this.totalPages() - 1
        }
    },

    events: {
        'click .paginator-prev'() {
            this.goToPage(this.currentPage() - 1);
        }, 
        'click .paginator-next'() {
            this.goToPage(this.currentPage() + 1);
        }
    }
});
