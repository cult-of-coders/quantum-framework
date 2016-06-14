import {LinkMany} from './links/linkMany.js';
import {LinkManyMeta} from './links/linkManyMeta.js';
import {LinkOne} from './links/linkOne.js';
import {LinkOneMeta} from './links/linkOneMeta.js';

Q('service quantum.collection-links.link', {
    factory: true,
    definition: class {
        /**
         * Values which represent for the relation a single link
         * @returns {string[]}
         */
        get oneTypes() {
            return ['one', '1', 'single'];
        }

        /**
         * Returns the strategies: one, many, one-meta, many-meta
         * @returns {string}
         */
        get strategy() {
            let strategy = this.isMany() ? 'many' : 'one';
            if (this.linkConfig.metadata) {
                strategy += '-meta';
            }

            return strategy;
        }

        /**
         * Returns the field name in the document where the actual relationships are stored.
         * @returns string
         */
        get linkStorageField() {
            return this.linkConfig.field;
        }

        constructor(mainCollection, linkName, linkConfig) {
            this.mainCollection = mainCollection;
            this.linkConfig = linkConfig;
            this.linkName = linkName;

            // check linkName must not exist in schema
            this._validate();
            this._extendSchema();
            this._extendHelpers();

            // if it's a virtual field make sure that when this is deleted, it will be removed from the references
            if (this.isVirtual()) {
                this._handleReferenceRemoval();
            }
        }

        /**
         * The collection that is linked with the current collection
         * @returns {Q('collection')}
         */
        getLinkedCollection() {
            return QF.use('collection', this.linkConfig.collection);
        }

        /**
         * The collection that represents the direction of the linker
         * @returns {Q('collection')}
         */
        getMainCollection() {
            return QF.use('collection', this.mainCollection);
        }

        /**
         * If the relationship for this link is of "many" type.
         */
        isMany() {
            return !this.isSingle();
        }

        /**
         * @returns {boolean}
         */
        isSingle() {
            return _.contains(this.oneTypes, this.linkConfig.type);
        }

        /**
         *
         * @returns {boolean}
         */
        isVirtual() {
            return this.linkConfig.virtual;
        }

        /**
         * @param object
         * @returns {*}
         */
        createAccessor(object) {
            let helperClass = this._getHelperClass();
            return new helperClass(this, object);
        }

        /**
         * @returns {*}
         * @private
         */
        _validate() {
            if (typeof(this.linkConfig) === 'string') {
                return this._prepareVirtual();
            }

            if (!this.linkConfig.collection) {
                this.linkConfig.collection = this.linkName;
            }

            Q('schema quantum.collection-links.link').validate(this.linkConfig);
        }

        /**
         * We need to apply same type of rules in this case.
         */
        _prepareVirtual() {
            let [collection, relatedLinkName] = this.linkConfig.split(' ');

            let linkConfig = {
                collection: collection,
                virtual: true,
                relatedLinkName: relatedLinkName
            };

            let linkStorage = QF.use('collection-links', collection);
            let relatedLink = linkStorage[relatedLinkName];

            if (!relatedLink) {
                throw new Meteor.Error('no-link', `You have a virtual field (${this.linkName}), but no definition on the other side for the field: ${relatedLinkName}`);
            }

            linkConfig.metadata = relatedLink.config.metadata;
            linkConfig.relatedLinker = relatedLink.service;
            linkConfig.relatedLinkConfig = relatedLink.config;

            this.linkConfig = linkConfig;
        }

        /**
         * Creates helpers for each link.
         * @private
         */
        _extendHelpers() {
            //console.log('extending helpers' + this.linkName);
            let helperName = this.linkName;
            let linker = this;

            this.getMainCollection().helpers({
                [helperName]: function() {
                    let cacheFieldName = `_${helperName}_link`;
                    if (this[cacheFieldName]) {
                        return this[cacheFieldName];
                    }

                    this[cacheFieldName] = linker.createAccessor(this);

                    return this[cacheFieldName];
                }
            });
        }

        /**
         * Depending on the strategy, we create the proper helper class
         * @private
         */
        _getHelperClass() {
            switch (this.strategy) {
                case 'many-meta': return LinkManyMeta;
                case 'many': return LinkMany;
                case 'one-meta': return LinkOneMeta;
                case 'one': return LinkOne;
            }

            throw new Meteor.Error('invalid-strategy', `${this.strategy} is not a valid strategy`);
        }

        /**
         * Extends the schema of the collection.
         * @private
         */
        _extendSchema() {
            if (!this.isVirtual()) { // meaning the linkStorageField is on the other side.
                if (!this.linkConfig.field) {
                    this.linkConfig.field = this._generateFieldName();
                }

                let collectionAtom = QF.use('collection', this.linkConfig.collection, true);
                if (collectionAtom.config.schema) {
                    this._attachSchema();
                }
            }
        }

        /**
         * If field name not present, we generate it.
         * @private
         */
        _generateFieldName() {
            let cleanedCollectionName = this.linkConfig.collection.replace(/\./g, '_');
            let defaultFieldPrefix = this.linkName + '_' + cleanedCollectionName;

            switch(this.strategy) {
                case 'many-meta':
                    return `${defaultFieldPrefix}_metas`;
                case 'many':
                    return `${defaultFieldPrefix}_ids`;
                case 'one-meta':
                    return `${defaultFieldPrefix}_meta`;
                case 'one':
                    return `${defaultFieldPrefix}_id`;
            }
        }

        /**
         * Actually attaches the field schema
         *
         * @returns {boolean}
         * @private
         */
        _attachSchema() {
            let fieldSchema, metadata = this.linkConfig.metadata;

            if (metadata) {
                if (_.keys(metadata).length) {
                    metadata._id = {type: String};
                    let schema = new SimpleSchema(metadata);
                    fieldSchema = (this.isMany()) ? {type: [schema]} : {type: schema};
                } else {
                    fieldSchema = (this.isMany()) ? {type: [Object], blackbox: true} : {type: Object, blackbox: true};
                }
            } else {
                fieldSchema = (this.isMany()) ? {type: [String]} : {type: String};
            }

            fieldSchema.optional = true;

            this.getLinkedCollection().attachSchema({
                [this.linkConfig.field]: fieldSchema
            });
        }

        /**
         * When a link that is declared virtual is removed, the reference will be removed from every other link.
         * @private
         */
        _handleReferenceRemoval() {
            this.getMainCollection().before.remove((userId, doc) => {
                let accessor = this.createAccessor(doc);
                _.each(accessor.fetch(), linkedObj => {
                    let linker = linkedObj[this.linkConfig.relatedLinkName]();
                    if (linker.remove) {
                        linker.remove(doc);
                    } else {
                        linker.unset();
                    }
                });
            })
        }
    }
});