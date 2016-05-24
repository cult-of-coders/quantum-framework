import {CollectionNode} from './lib/collectionNode.js';
import {FieldNode} from './lib/fieldNode.js';

S('query-parser', {
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
                let link = root.collection.getLink ? root.collection.getLink(fieldName) : null;
                if (link) {
                    let subroot = new CollectionNode(link.service.getLinkedCollection(), body, fieldName);
                    root.add(subroot);
                    return this.parse(subroot);
                }

                // it's not a link and not a special variable => we assume it's a field.
                let fieldNode = new FieldNode(fieldName, body);
                root.add(fieldNode);
            });
        }

        get composition() {
            return this.root.compose()
        }
    }
});