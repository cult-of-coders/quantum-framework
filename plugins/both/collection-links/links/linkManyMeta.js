import {Link} from './base.js';

export class LinkManyMeta extends Link {
    applyFindFilters(filters) {
        let field = this.getLinkStorageField();
        filters._id = {$in: _.pluck(this.object[field], '_id')};
    }

    applyFindFiltersForVirtual(filters) {
        filters[this.getLinkStorageField() + '._id'] = this.object._id;
    }

    add(what, metadata = {}) {
        if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Add/Remove operations should be done from the owner of the relationship');

        if (typeof(what) != 'array') what = [what];
        let _ids = _.map(what, el => this._identity(el));
        let field = this.getLinkStorageField();

        this.object[field] = this.object[field] || [];
        let metadatas = [];

        _.each(_ids, _id => {
            let localMetadata = _.clone(metadata);
            localMetadata._id = _id;

            this.object[field].push(localMetadata);
            metadatas.push(localMetadata);
        });

        let modifier = {
            $pushAll: {
                [field]: metadatas
            }
        };

        this.linker.getMainCollection().update(this.object._id, modifier);
    }

    metadata(what, extendMetadata) {
        if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Metadata operations should be done from the owner of the relationship');

        let _id = this._identity(what);
        let field = this.getLinkStorageField();

        let metadata = _.find(this.object[field], metadata => metadata._id == _id);
        if (extendMetadata === undefined) {
            return metadata;
        } else {
            _.extend(metadata, extendMetadata);
            let subfield = field + '._id';
            let subfieldUpdate = field + '.$';

            this.linker.getMainCollection().update({
                _id: this.object._id,
                [subfield]: _id
            }, {
               $set: {
                   [subfieldUpdate]: metadata
               }
            });
        }
    }

    remove(what) {
        if (typeof(what) != 'array') what = [what];
        let _ids = _.map(what, el => this._identity(el));
        let field = this.getLinkStorageField();

        this.object[field] = _.filter(this.object[field], link => !_.contains(_ids, link._id));

        let modifier = {
            $pull: {
                [field]: {
                    $elemMatch: {
                        _id: {
                            $in: _ids
                        }
                    }
                }
            }
        };

        this.linker.getMainCollection().update(this.object._id, modifier);
    }
}