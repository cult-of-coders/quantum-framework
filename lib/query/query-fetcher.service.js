QF.add('service', 'query-fetcher', {
    definition: class {
        fetch(collection, body) {
            let parser = QF.use('service', 'query-parser');

            let query = parser.build(collection, body);

            return query.fetchSimple();
        }
    }
});