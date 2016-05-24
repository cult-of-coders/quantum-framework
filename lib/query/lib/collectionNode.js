import {FieldNode} from './fieldNode.js';

export class CollectionNode {
    constructor(collection, body, linkName) {
        this.linkName = linkName;
        this.nodes = [];
        this.collection = collection;
        this.body = body;
        this.props = {};
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

    add(node) {
        node.parent = this;
        this.nodes.push(node);
    }

    compose() {
        let node = this;
        let collection = this.collection;

        return {
            find(parent) {
                let filters = {}, options = {}, metaFilters = {};
                node.applyProps(filters, options, metaFilters);

                if (parent) {
                    // composition
                    let linker = node.link.service;
                    let accessor = linker.createAccessor(parent);

                    return accessor.find(filters, options, metaFilters);
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

    applyProps(filters, options) {
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

        // it will only get here if it has collectionNodes children
        _.each(this.collectionNodes, (collectionNode) => {
            let linker = collectionNode.link.service;
            options.fields[linker.linkStorageField] = 1;
        });
    }

    applyFields(options) {
        options.fields = options.fields || {};

        let fieldNodes = _.filter(this.nodes, n => n instanceof FieldNode);
        _.each(fieldNodes, n => n.applyFields(options.fields))
    }
}
