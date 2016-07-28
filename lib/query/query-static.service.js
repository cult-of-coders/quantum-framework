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
            if (!collection) return data;

            const isSingle = !_.isArray(data);
            let array = _.isArray(data) ? data : [data];

            _.each(array, element => {
                this._processElement(element, collection);
            });

            if (collection._transform && collection._helpers) {
                array = _.map(array, element => {
                    let filteredHelpers;
                    if (collection.getLink) {
                        filteredHelpers = _.omit(collection._helpers.prototype, (v, k, o) => {
                            return !!collection.getLink(k)
                        });
                    } else {
                        filteredHelpers = collection._helpers.prototype;
                    }

                    return _.extend({}, filteredHelpers, element);
                });
            }

            return isSingle ? _.first(array) : array;
        }

        _processElement(element, collection) {
            _.each(element, (value, key) => {
                if (collection.getLink) {
                    const link = collection.getLink(key);
                    if (link) {
                        element[key] = this.recursivelyApplyTransformers(link.service.getLinkedCollection(), value);
                    }
                }
            })
        }
    }
});