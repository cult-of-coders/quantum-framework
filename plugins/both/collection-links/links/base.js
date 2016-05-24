export class Link {
    get config() { return this.linker.linkConfig; }

    get isVirtual() { return this.linker.isVirtual() }

    constructor(linker, object) {
        this.linker = linker;
        this.object = object;
    }

    getLinkStorageField() {
        if (this.linker.isVirtual()) {
            return this.config.relatedLinkConfig.field;
        } else {
            return this.config.field;
        }
    }

    find(filters = {}, options = {}, metaFilters = {}) {
        let linker = this.linker;
        this.clean();

        if (this.applyMetaFilters && _.keys(metaFilters).length) {
            this.applyMetaFilters(filters, metaFilters);
        }

        if (!linker.isVirtual()) {
            this.applyFindFilters(filters);
            return linker.getLinkedCollection().find(filters, options);
        } else {
            this.applyFindFiltersForVirtual(filters);
            return linker.getLinkedCollection().find(filters, options);
        }
    }

    /**
     * @param filters
     * @param options
     * @param others
     * @returns {*|{content}|any}
     */
    fetch(filters, options, ...others) {
        if (this.isSingle) {
            return _.first(this.find(filters, options, ...others).fetch());
        }

        return this.find(filters, options, ...others).fetch();
    }

    clean() {}

    applyFindFilters() { throw 'Not Implemented' }
    applyFindFiltersForVirtual() { throw 'Not Implemented'; }

    /**
     * @param objectOrString
     * @returns {*}
     * @private
     */
    _identity(objectOrString) {
        if (!objectOrString) {
            return null;
        }

        return typeof(objectOrString) == 'object' ? objectOrString._id : objectOrString;
    }
}