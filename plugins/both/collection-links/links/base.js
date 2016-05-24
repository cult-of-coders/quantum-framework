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

    find(filters = {}, options = {}, ...others) {
        let linker = this.linker;

        if (!linker.isVirtual()) {
            this.applyFindFilters(filters);
            return linker.getLinkedCollection().find(filters, options, ...others);
        } else {
            this.applyFindFiltersForVirtual(filters);
            return linker.getLinkedCollection().find(filters, options, ...others);
        }
    }

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