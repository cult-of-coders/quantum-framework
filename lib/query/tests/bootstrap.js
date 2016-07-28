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
        },
        comment_resolve: {
            resolve(object) {
                return Q('collection query_comment').find({resourceId: object._id}).fetch();
            }
        }
    },
    model: {
        testModelFunction() {
            return this._id;
        }
    }
});

Q('collection query_comment', {});
Q('collection query_group', {
    model: {
        testModelFunction() {
            return this._id;
        }
    }
});
Q('collection query_author', {});