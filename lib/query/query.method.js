Meteor.methods({
    'quantum.query.method'(collection, body) {
        QF.use('collection-exposure', collection);
        let fetcher = QF.use('service', 'query-fetcher');

        return fetcher.fetch(collection, body);
    }
});