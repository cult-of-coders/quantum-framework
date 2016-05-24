export class Link {
    get config() { return this.linker.linkConfig; }

    get isVirtual() { return this.linker.isVirtual() }

    constructor(linker, object) {
        this.linker = linker;
        this.object = object;
    }

    /**
     * Returns the field name where the links are stored.
     *
     * @returns string
     */
    getLinkStorageField() {
        if (this.linker.isVirtual()) {
            return this.config.relatedLinkConfig.field;
        } else {
            return this.config.field;
        }
    }

    /**
     * Finds linked data.
     *
     * @param filters
     * @param options
     * @param metaFilters
     * @returns {*}
     */
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
        return this.find(filters, options, ...others).fetch();
    }

    /**
     * @param filters
     * @param options
     * @param others
     * @returns {*|{content}|any}
     */
    fetchOne(filters, options, ...others) {
        return _.first(this.fetch(filters, options, ...others));
    }

    /**
     * When we are dealing with multiple type relationships, $in would require an array. If the field value is null, it will fail
     * We use clean to make it an empty array by default.
     */
    clean() {}

    /**
     * We have an object stored. Based on that object. How do I receive the related elements ?
     */
    applyFindFilters(filters) { throw 'Not Implemented' }

    /**
     * I have a virtual link, how should I search in the other collection to retrieve my data ?
     */
    applyFindFiltersForVirtual(filters) { throw 'Not Implemented'; }

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