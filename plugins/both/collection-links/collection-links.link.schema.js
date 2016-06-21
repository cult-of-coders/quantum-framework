Q('schema quantum.collection-links.link', {
    type: {
        type: String,
        optional: true,
        defaultValue: 'one'
    },
    collection: {
        type: String,
        optional: true
    },
    field: {
        type: String,
        optional: true
    },
    metadata: {
        type: null,
        blackbox: true,
        optional: true
    },
    resolve: {
        type: Function,
        optional: true
    }
});

