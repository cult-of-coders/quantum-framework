import _ from 'underscore';

QF.add('service', 'query-static', {
    definition: class {
        fetch(collectionName, body, callback) {
            const onResult = (err, res) => {
                if (!err) {
                    res = this.recursivelyApplyTransformers(QF.use('collection', collectionName), res);
                }

                callback(err, res);
            };

            Meteor.call('quantum.query.method', collectionName, body, onResult);
        }

        fetchData(collectionName, body, callback) {
            Meteor.call('quantum.query.method', collectionName, body, callback);
        }

        recursivelyApplyTransformers(collection, data) {
            let array = _.isArray(data) ? data : [data];

            if (collection._transform) {
                _.each(array, element => {
                    _.extendOwn(element, collection._helpers.prototype);
                });

                array = _.map(array, element => {
                    return _.extend({}, collection._helpers.prototype, element);
                });
            }

            _.each(array, element => {
                _.each(element, (value, key) => {
                    if (collection.getLink) {
                        const link = collection.getLink(key);
                        if (link) {
                            element[key] = this.recursivelyApplyTransformers(link.service.getLinkedCollection(), value);
                        }
                    }
                })
            });

            return array;
        }
    }
});