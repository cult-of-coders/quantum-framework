import {Link} from './base.js';

export class LinkOne extends Link {
    get isSingle() { return true }

    applyFindFilters(filters) {
        filters._id = this.object[this.getLinkStorageField()];
    }

    applyFindFiltersForVirtual(filters) {
        filters[this.getLinkStorageField()] = this.object._id;
    }

    set(what) {
        if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Set/Unset operations should be done from the owner of the relationship');

        let field = this.getLinkStorageField();
        let _id = this._identity(what);

        this.object[field] = _id;

        this.linker.getMainCollection().update(this.object._id, {
            $set: {
                [field]: _id
            }
        });
    }

    unset() {
        if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Set/Unset operations should be done from the owner of the relationship');

        let field = this.getLinkStorageField();
        this.object[field] = null;

        this.linker.getMainCollection().update(this.object._id, {
            $set: {
                [field]: null
            }
        });
    }
}