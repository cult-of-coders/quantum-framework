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
        }
    }
});

Q('collection query_comment', {});
Q('collection query_group', {});