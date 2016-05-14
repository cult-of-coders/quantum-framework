class RoleManager {
    add(userId, role, group) {
        return Roles.addUsersToRoles(userId, role, group)
    }

    remove(userId, role, group) {
        return Roles.removeUsersFromRoles(userId, role, group)
    }

    has(userId, role, group) {
        if (role == 'ANONYMOUS') {
            return true;
        }

        if (role == 'USER' && userId) {
            return true;
        }

        let response = Roles.userIsInRole(userId, [role], group);

        if (!response) {
            _.each(this.getRolesBelow(role), (subrole) => {
                let response = Roles.userIsInRole(userId, [subrole], group);
                if (response) {
                    return true;
                }
            })
        }

        return response;
    }

    storeHierarchy(hierarchy) {
        this.hierarchy = hierarchy;
    }

    getRolesBelow(targetRole) {
        if (!this.hierarchy || !this.hierarchy[targetRole]) {
            return [];
        }

        return this.hierarchy[targetRole];
    }

    check(userId, roles) {
        let hasRoles = false;

        if (!Array.isArray(roles)) {
            roles = [roles];
        }

        _.each(roles, (role) => {
            if (this.has(userId, role)) {
                hasRoles = true;
            }
        });

        if (!hasRoles) {
            throw `The user does not have the required roles: ${roles.join(',')}`;
        }
    }
}

QF.add('service', 'roles', {
    definition: RoleManager
});
