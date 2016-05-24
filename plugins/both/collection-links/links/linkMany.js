import {Link} from './base.js';

export class LinkMany extends Link {
    clean() {
        if (!this.object[this.getLinkStorageField()]) {
            this.object[this.getLinkStorageField()] = [];
        }
    }

    /**
     * @param filters
     */
    applyFindFilters(filters) {
        filters._id = {$in: this.object[this.getLinkStorageField()]};
    }

    /**
     * @param filters
     */
    applyFindFiltersForVirtual(filters) {
        filters[this.getLinkStorageField()] = {$in: [this.object._id]};
    }

    /**
     * Ads the _ids to the object.
     * @param what
     */
    add(what) {
        if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Add/Remove operations should be done from the owner of the relationship');

        if (!_.isArray(what)) what = [what];
        let _ids = _.map(what, el => this._identity(el));
        let field = this.getLinkStorageField();

        if (typeof(this.object[field]) != 'array') {
            this.object[field] = [];
        }

        this.object[field] = _.union(this.object[field], _ids);

        let modifier = {
            $pushAll: {
                [field]: _ids
            }
        };

        this.linker.getMainCollection().update(this.object._id, modifier);
    }

    /**
     * @param what
     */
    remove(what) {
        if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Add/Remove operations should be done from the owner of the relationship');

        if (!_.isArray(what)) what = [what];
        let _ids = _.map(what, el => this._identity(el));
        let field = this.getLinkStorageField();

        if (typeof(this.object[field]) != 'array') {
            this.object[field] = [];
        }
        this.object[field] = _.filter(this.object[field], _id => !_.contains(_ids, _id));

        let modifier = {
            $pullAll: {
                [field]: _ids
            }
        };

        this.linker.getMainCollection().update(this.object._id, modifier);
    }
}