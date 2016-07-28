import {FieldNode} from './fieldNode.js';

export class CollectionNode {
    constructor(collection, body, linkName) {
        this.linkName = linkName;
        this.nodes = [];
        this.collection = collection;
        this.body = body;
        this.props = {};
        this.parent = null;
    }

    get collectionNodes() {
        return _.filter(this.nodes, n => n instanceof CollectionNode)
    }

    get fieldNodes() {
        return _.filter(this.nodes, n => n instanceof FieldNode);
    }

    // only available for subcollections.
    get link() {
        if (this.parent) {
            return this.parent.collection.getLink(this.linkName)
        }
    }

    get linker() {
        if (this.parent) {
            return this.parent.collection.getLink(this.linkName).service
        }
    }

    add(node) {
        node.parent = this;
        this.nodes.push(node);
    }

    compose() {
        let node = this;
        let collection = this.collection;

        return {
            find(parent) {
                let filters = {}, options = {};
                node.applyProps(filters, options);

                if (parent) {
                    // composition
                    let linker = node.linker;
                    let accessor = linker.createAccessor(parent);

                    return accessor.find(filters, options);
                } else {
                    // it goes into the main collection
                    if (collection.findSecure) {
                        return collection.findSecure(this.userId, filters, options);
                    }

                    return collection.find(filters, options);
                }
            },

            children: _.map(node.collectionNodes, n => n.compose())
        }
    }

    /**
     * @returns {*|{content}|any}
     */
    fetchSimple(parentObject, fetchOptions = {}) {
        let filters = {}, options = {};
        this.applyProps(filters, options);

        let results = [];

        // TODO: treat cases better when this.linker.isResolver == true
        if (parentObject) {
            // composition
            let accessor = this.linker.createAccessor(parentObject);

            results = accessor.fetch(filters, options);
        } else {
            results = this.collection.find(filters, options).fetch();
        }

        // there are cases where we need nested data with models
        // if our current retrieval context is a resolver link, we don't need to do anything.
        if (fetchOptions.applyCollectionModel && this.collection && this.collection._transform) {
            results = _.map(results, this.collection._transform);
        }

        _.each(results, result => {
            _.each(this.collectionNodes, node => {
                result[node.linkName] = node.fetchSimple(result, fetchOptions);
                delete result[node.linker.linkStorageField];
            })
        });

        if (parentObject && this.linker.isSingle()) {
            return _.first(results);
        }

        return results;
    }

    applyProps(filters, options, addNestedCollectionFields = true) {
        _.extend(filters, this.props.$filters || {});
        _.extend(options, this.props.$options || {});

        options.fields = options.fields || {};

        _.each(this.fieldNodes, (fieldNode) => {
            fieldNode.applyFields(options.fields);
        });

        // if at this stage it is empty we assume we want all fields.
        if (!_.keys(options.fields).length) {
            return;
        }

        if (addNestedCollectionFields) {
            // it will only get here if it has collectionNodes children
            _.each(this.collectionNodes, (collectionNode) => {
                let linker = collectionNode.linker;
                options.fields[linker.linkStorageField] = 1;
            });
        }
    }

    applyFields(options) {
        options.fields = options.fields || {};

        let fieldNodes = _.filter(this.nodes, n => n instanceof FieldNode);
        _.each(fieldNodes, n => n.applyFields(options.fields))
    }
}
