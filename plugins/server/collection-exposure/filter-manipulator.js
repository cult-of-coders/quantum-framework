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
        _.each(this.filtersByRoles, (actualFilters, roleName) => {
            if (Quantum.Roles.has(roleName)) {
                _.extend(filters, actualFilters);

                return true;
            }
        });

        throw 'We could not find any matching role';
    }

    /**
     *
     * @param userId
     * @param options
     */
    filterFieldsByRoles(userId, options) {
        _.each(this.fieldsByRoles, (fields, roleName) => {
            if (Quantum.Roles.has(roleName)) {
                options.fields = fields
            }
        })
    }
}