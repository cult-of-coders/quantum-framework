/**
 * @class FilterManipulation
 */
Quantum.Model.FilterManipulation = class {
    /**
     * @param secureByRoles
     */
    constructor(secureByRoles) {
        this.secureByRoles = secureByRoles;
        this.roles = QF.use('service', 'roles');
    }

    /**
     *
     * @param userId
     * @param filters
     * @param options
     */
    apply(userId, filters, options) {
        if (!this.secureByRoles) return;

        if (this.secureByRoles.length === 0) {
            return; // he hasn't setup any filters, otherwise it means we block everyone from a publication which makes no sense.
        }

        let foundRole = false;
        _.each(this.secureByRoles, (secureFunction, roleName) => {
            if (foundRole) return;

            if (this.roles.has(userId, roleName)) { // the first role it found it applies filters so make sure you put it in a hierarchy.
                secureFunction(userId, filters, options);
                foundRole = true;
            }
        });

        if (!foundRole) {
            // In case no role has been actually found we automatically throw an exception because something is definitely breached.
            throw new Meteor.Error('no-role-found', 'We could not find any matching role');
        }
    }
};