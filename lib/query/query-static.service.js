QF.add('service', 'query-static', {
    definition: class {
        fetch(collection, body, callback) {
            Meteor.call('quantum.query.method', collection, body, callback);
        }
    }
});