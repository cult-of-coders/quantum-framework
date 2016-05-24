Meteor.publishComposite('query', function(collection, body) {
    QF.use('collection-exposure', collection);
    // it will fail if you do not have an exposure for it.
    let parser = QF.use('service', 'query-parser');

    let query = parser.build(collection, body);

    return query.composition;
});