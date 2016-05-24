import {CollectionNode} from './lib/collectionNode.js';
import {FieldNode} from './lib/fieldNode.js';
import {dotize} from '../dotize.js';

QF.add('service', 'query-parser', {
    factory: true,
    definition: class {
        /**
         * @param collectionName
         * @param body
         */
        constructor(collectionName, body) {
            this.collectionName = collectionName;
            this.collection = QF.use('collection', collectionName);
            this.body = body;
            this.root = new CollectionNode(this.collection, body);

            this.parse(this.root);
        }

        get specialFields() {
            return ['$filters', '$options']
        }

        /**
         * Creates node objects from
         * @param root Node
         */
        parse(root) {
            _.each(root.body, (body, fieldName) => {
                if (_.contains(this.specialFields, fieldName)) {
                    return _.extend(root.props, {
                        [fieldName]: body
                    });
                }

                // checking if it is a link.
                let linker = this._getLinker(root, fieldName);

                if (linker) {
                    let subroot = new CollectionNode(linker.getLinkedCollection(), body, fieldName);
                    root.add(subroot);

                    return this.parse(subroot);
                }

                // it's not a link and not a special variable => we assume it's a field.
                if (_.isObject(body)) {
                    let dotted = dotize.convert({[fieldName]: body});
                    _.each(dotted, (value, key) => {
                        root.add(new FieldNode(key, value));
                    });
                } else {
                    let fieldNode = new FieldNode(fieldName, body);
                    root.add(fieldNode);
                }
            });
        }

        /**
         * Builds up the structure for publish composite
         * @returns {{find, children}|*}
         */
        compose() {
            return this.root.compose()
        }

        /**
         * @returns {*|{content}|any}
         */
        fetchSimple() {
            return this.root.fetchSimple()
        }

        /**
         * @param collectionNode
         * @param linkName
         * @returns {*}
         * @private
         */
        _getLinker(collectionNode, linkName) {
            let collection = collectionNode.collection;
            if (collection.getLink) {
                let link = collection.getLink(linkName);

                return (link) ? link.service : null;
            }

            return null;
        }
    }
});