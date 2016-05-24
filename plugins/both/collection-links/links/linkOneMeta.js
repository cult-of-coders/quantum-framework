import {Link} from './base.js';

export class LinkOneMeta extends Link {
    applyFindFilters(filters) {
        let value = this.object[this.getLinkStorageField()];

        filters._id = value ? value._id : value;
    }

    applyFindFiltersForVirtual(filters) {
        filters[this.getLinkStorageField() + '._id'] = this.object._id;
    }

    set(what, metadata = {}) {
        if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Set/Unset operations should be done from the owner of the relationship');

        let field = this.getLinkStorageField();
        metadata._id = this._identity(what);
        this.object[field] = metadata;

        this.linker.getMainCollection().update(this.object._id, {
            $set: {
                [field]: metadata
            }
        });
    }

    metadata(extendMetadata) {
        if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Metadata operations should be done from the owner of the relationship');

        let field = this.getLinkStorageField();

        if (!extendMetadata) {
            return this.object[field];
        } else {
            _.extend(this.object[field], extendMetadata);

            this.linker.getMainCollection().update(this.object._id, {
                $set: {
                    [field]: this.object[field]
                }
            });
        }
    }

    unset() {
        if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Set/Unset operations should be done from the owner of the relationship');

        let field = this.getLinkStorageField();
        this.object[field] = {};

        this.linker.getMainCollection().update(this.object._id, {
            $set: {
                [field]: {}
            }
        });
    }
}