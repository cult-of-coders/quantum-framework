/**
 * @class FilterManipulation
 */
Quantum.Model.FilterManipulation = class {
    /**
     * @param filtersByRoles
     * @param fieldsByRoles
     */
    constructor(filtersByRoles, fieldsByRoles) {
        this.filtersByRoles = filtersByRoles;
        this.fieldsByRoles = fieldsByRoles;
    }

    /**
     *
     * @param userId
     * @param filters
     * @param options
     */
    apply(userId, filters, options) {
        if (this.filtersByRoles) {
            this.applyFiltersByRoles(userId, filters)
        }
        if (this.fieldsByRoles) {
            this.filterFieldsByRoles(userId, options)
        }
    }

    /**
     * Applying well defined smart filters.
     *
     * @param userId
     * @param filters
     */
    applyFiltersByRoles(userId, filters) {
        if (!this.filtersByRoles) {
            return;
        }

        let foundEvent = class {
        };
        try {
            if (this.filtersByRoles.length === 0) {
                return; // he hasn't setup any filters, otherwise it means we block everyone from a publication which makes no sense.
            }

            _.each(this.filtersByRoles, (actualFilters, roleName) => {
                if (Quantum.Roles.has(roleName)) { // the first role it found it applies filters so make sure you put it in a hierarchy.
                    _.extend(filters, actualFilters);
                    throw foundEvent;
                }
            });
        } catch (e) {
            if (e instanceof foundEvent) {
                return true;
            }

            throw e;
        }

        // In case no role has been actually found we automatically throw an exception because something is definitely breached.

        throw 'We could not find any matching role';
    }

    /**
     *
     * @param userId
     * @param options
     */
    filterFieldsByRoles(userId, options) {
        if (!this.fieldsByRoles) {
            return;
        }

        let foundEvent = class {
        };
        try {
            _.each(this.fieldsByRoles, (fields, roleName) => {
                if (Quantum.Roles.has(roleName)) {
                    options.fields = fields;
                    throw foundEvent;
                }
            })
        } catch (e) {
            if (e instanceof foundEvent) {
                return;
            }

            throw e;
        }
    }
};