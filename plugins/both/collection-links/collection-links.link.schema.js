Q('schema quantum.collection-links.link', {
    type: {
        type: String
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
    }
});

