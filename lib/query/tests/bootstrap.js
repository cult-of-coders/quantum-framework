Q('collection query_post', {
    links: {
        'comments': {
            collection: 'query_comment',
            type: '*'
        },
        'groups': {
            collection: 'query_group',
            type: '*',
            metadata: {}
        },
        author: {
            collection: 'query_author',
            type: 'one'
        }
    },
    model: {
        testModelFunction() {
            return this._id;
        }
    }
});

Q('collection query_comment', {});
Q('collection query_group', {});
Q('collection query_author', {});